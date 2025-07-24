use std::ops::Sub;

use crate::error::*;
use anchor_lang::prelude::*;
use anchor_lang::system_program;
use anchor_spl::token_interface::{
    self, Mint, MintTo, TokenAccount, TokenInterface, Transfer, TransferChecked,
};
use std::ops::{Add, Div, Mul};

#[account]
#[derive(InitSpace)]
pub struct LiquidityPool {
    #[max_len(10, 4)]
    pub assets: Vec<Pubkey>, // 资产列表
    pub bump: u8, // 用于生成 PDA 的 bump
}

impl LiquidityPool {
    pub const SEED_PREFIX: &'static [u8] = b"liquidity_pool";
    pub fn new(bump: u8) -> Self {
        Self {
            assets: vec![],
            bump,
        }
    }
}

/// 此特性用于封装流动性池的功能，当从 Anchor 上下文（即 Account<'_, LiquidityPool>）
/// 中提取流动性池账户时，可以在该账户上调用这些功能。
pub trait LiquidityPoolAccount<'info> {
    fn check_asset_key(&self, key: &Pubkey) -> Result<()>;
    fn add_asset(
        &mut self,
        key: Pubkey,
        payer: &Signer<'info>,
        system_program: &Program<'info, System>,
    ) -> Result<()>;
    fn realloc(
        &mut self,
        space_to_add: usize,
        payer: &Signer<'info>,
        system_program: &Program<'info, System>,
    ) -> Result<()>;

    fn fund(
        &mut self,
        deposit: (
            &InterfaceAccount<'info, Mint>,
            &InterfaceAccount<'info, TokenAccount>,
            &InterfaceAccount<'info, TokenAccount>,
            u64,
        ),
        authority: &Signer<'info>,
        system_program: &Program<'info, System>,
        token_program: &Interface<'info, TokenInterface>,
    ) -> Result<()>;
    fn process_swap(
        &mut self,
        receive: (
            &InterfaceAccount<'info, Mint>,
            &InterfaceAccount<'info, TokenAccount>,
            &InterfaceAccount<'info, TokenAccount>,
        ),
        pay: (
            &InterfaceAccount<'info, Mint>,
            &InterfaceAccount<'info, TokenAccount>,
            &InterfaceAccount<'info, TokenAccount>,
            u64,
        ),
        authority: &Signer<'info>,
        token_program: &Interface<'info, TokenInterface>,
    ) -> Result<()>;
}

impl<'info> LiquidityPoolAccount<'info> for Account<'info, LiquidityPool> {
    fn check_asset_key(&self, key: &Pubkey) -> Result<()> {
        /// 验证资产的密钥是否存在于流动性池的铸币地址列表中，如果不存在则抛出错误
        if !self.assets.contains(key) {
            return Err(SwapProgramError::InvalidAssetKey.into());
        }
        Ok(())
    }

    fn add_asset(
        &mut self,
        key: Pubkey,
        payer: &Signer<'info>,
        system_program: &Program<'info, System>,
    ) -> Result<()> {
        match self.check_asset_key(&key) {
            Ok(()) => {
                // 资产已存在，执行添加逻辑
            }
            Err(_) => {
                // 资产不存在，执行错误处理逻辑
                self.realloc(32, payer, system_program)?;
                self.assets.push(key);
            }
        }
        Ok(())
    }
    /// 重新分配账户大小以适应数据大小的变化。在本程序中，
    /// 当通过向铸币地址的向量（`Vec<Pubkey>`）中推送一个 `Pubkey` 来增加其大小时，
    /// 此函数用于重新分配流动性池的账户。
    fn realloc(
        &mut self,
        space_to_add: usize,
        payer: &Signer<'info>,
        system_program: &Program<'info, System>,
    ) -> Result<()> {
        let account_info = self.to_account_info();
        let new_account_size = account_info.data_len() + space_to_add;

        // 重新分配账户大小 需要的租金
        let lamports_required = Rent::get()?.minimum_balance(new_account_size);
        // 检查账户是否有足够的余额
        let additional_rent_to_fund = lamports_required.sub(account_info.lamports());
        // 执行额外租金的转账操作
        if additional_rent_to_fund > 0 {
            let cpi_ctx = CpiContext::new(
                system_program.to_account_info(),
                system_program::Transfer {
                    from: payer.to_account_info(),
                    to: account_info.to_account_info(),
                },
            );
            system_program::transfer(cpi_ctx, additional_rent_to_fund)?;
        }

        account_info.resize(new_account_size)?;
        Ok(())
    }
    /// 通过将资产从付款人（或流动性提供者）的代币账户转移到流动性池的代币账户，为流动性池提供资金。
    /// 在这个函数中，如果铸币地址不存在，程序还会将其添加到存储在 `LiquidityPool`
    ///  数据中的铸币地址列表中，并重新分配账户大小。

    fn fund(
        &mut self,
        deposit: (
            &InterfaceAccount<'info, Mint>,
            &InterfaceAccount<'info, TokenAccount>,
            &InterfaceAccount<'info, TokenAccount>,
            u64,
        ),
        authority: &Signer<'info>,
        system_program: &Program<'info, System>,
        token_program: &Interface<'info, TokenInterface>,
    ) -> Result<()> {
        let (mint, payer_token_account, pool_token_account, amount) = deposit;
        self.add_asset(mint.key(), authority, system_program)?;
        // 处理将资产从付款人代币账户转移到池的代币账户
        process_transfer_to_pool(
            mint,
            payer_token_account,
            pool_token_account,
            amount,
            authority,
            token_program,
        )?;
        Ok(())
    }
    /// 此函数将确保所请求的两种资产 - 用户提议支付的资产以及用户请求换取的资产 - 均存在于 LiquidityPool 数据的支持铸币地址列表中。
    ///
    /// 然后，它将使用常数乘积算法 r = f(p)，根据用户提议支付的资产数量，计算所请求的 “接收” 资产的数量。
    ///
    /// 计算完成后，它将处理这两笔转移。
    fn process_swap(
        &mut self,
        receive: (
            &InterfaceAccount<'info, Mint>,
            &InterfaceAccount<'info, TokenAccount>,
            &InterfaceAccount<'info, TokenAccount>,
        ),
        pay: (
            &InterfaceAccount<'info, Mint>,
            &InterfaceAccount<'info, TokenAccount>,
            &InterfaceAccount<'info, TokenAccount>,
            u64,
        ),
        authority: &Signer<'info>,
        token_program: &Interface<'info, TokenInterface>,
    ) -> Result<()> {
        // (From, To)
        let (receive_mint, pool_recieve, payer_recieve) = receive;
        self.check_asset_key(&receive_mint.key())?;
        let (pay_mint, payer_pay, pool_pay, pay_amount) = pay;
        self.check_asset_key(&pay_mint.key())?;
        //确定付款人将收到的所请求资产的金额
        let receive_amount = determine_swap_receive(
            pool_recieve.amount,
            receive_mint.decimals,
            pool_pay.amount,
            pay_mint.decimals,
            pay_amount,
        )?;
        // 处理将资产从池的代币账户转移到付款人的代币账户
        if receive_amount > 0 {
            process_transfer_to_pool(
                pay_mint,
                payer_pay,
                pool_pay,
                pay_amount,
                authority,
                token_program,
            )?;
            process_transfer_from_pool(
                receive_mint,
                pool_recieve,
                payer_recieve,
                receive_amount,
                self,
                token_program,
            )?;
        } else {
            return Err(SwapProgramError::InvalidSwapNotEnoughPay.into());
        }
        Ok(())
    }
}

/// 使用 CPI 将资金从付款人的一个代币账户转移到池的代币账户
fn process_transfer_to_pool<'info>(
    mint: &InterfaceAccount<'info, Mint>,
    from: &InterfaceAccount<'info, TokenAccount>,
    to: &InterfaceAccount<'info, TokenAccount>,
    amount: u64,
    authority: &Signer<'info>,
    token_program: &Interface<'info, TokenInterface>,
) -> Result<()> {
    // Get the number of decimals for this mint
    let decimals = mint.decimals;

    // Create the TransferChecked struct with required accounts
    let cpi_accounts = TransferChecked {
        mint: mint.to_account_info(),
        from: from.to_account_info(),
        to: to.to_account_info(),
        authority: authority.to_account_info(),
    };

    // The program being invoked in the CPI
    let cpi_program = token_program.to_account_info();

    // Combine the accounts and program into a "CpiContext"
    let cpi_context = CpiContext::new(cpi_program, cpi_accounts);

    // Make CPI to transfer_checked instruction on token program
    token_interface::transfer_checked(cpi_context, amount, decimals)?;
    Ok(())
}
/// 使用带有签名者种子的 CPI，将资金从池子的代币账户转移到支付者的代币账户
fn process_transfer_from_pool<'info>(
    mint: &InterfaceAccount<'info, Mint>,
    from: &InterfaceAccount<'info, TokenAccount>,
    to: &InterfaceAccount<'info, TokenAccount>,
    amount: u64,
    pool: &Account<'info, LiquidityPool>,
    token_program: &Interface<'info, TokenInterface>,
) -> Result<()> {
    let signer_seeds: &[&[&[u8]]] = &[&[LiquidityPool::SEED_PREFIX, &[pool.bump]]];

    let decimals = mint.decimals;

    let cpi_accounts = TransferChecked {
        mint: mint.to_account_info(),
        from: from.to_account_info(),
        to: to.to_account_info(),
        authority: pool.to_account_info(),
    };
    let cpi_program = token_program.to_account_info();
    let cpi_context = CpiContext::new(cpi_program, cpi_accounts).with_signer(signer_seeds);
    token_interface::transfer_checked(cpi_context, amount, decimals)?;
    Ok(())
}

/// 使用带签名者种子的 CPI，将资金从池子的代币账户转移到支付者的代币账户。
/// 使用带签名者种子的 CPI，将资金从池子的代币账户转移到支付者的代币账户。
///

/// The constant-product algorithm `f(p)` to determine the allowed amount of the
/// receiving asset that can be returned in exchange for the amount of the paid
/// asset offered
/// 用于确定以提供的已支付资产数量换取可返回的接收资产允许数量的常数乘积算法 f(p)
///
/// ```
/// K = a * b * c * d * P * R
/// K = a * b * c * d * (P + p) * (R - r)
///
/// a * b * c * d * P * R = a * b * c * d * (P + p) * (R - r)
/// PR = (P + p) * (R - r)
/// PR = PR - Pr + Rp - pr
/// 0 = 0 - Pr + Rp - pr
/// -Rp = -Pr - pr
/// -Rp = r(-P - p)
/// r = (-Rp) / (-P - p)
/// r = [-1 * Rp] / [-1 * (P + p)]
/// r = Rp / (P + p)
///
/// r = f(p) = (R * p) / (P + p)
/// ```
fn determine_swap_receive(
    pool_recieve_balance: u64,
    receive_decimals: u8,
    pool_pay_balance: u64,
    pay_decimals: u8,
    pay_amount: u64,
) -> Result<u64> {
    // 使用各自铸币的小数位数将所有值转换为标称浮点数
    // 位数
    let big_r = convert_to_float(pool_recieve_balance, receive_decimals);
    let big_p = convert_to_float(pool_pay_balance, pay_decimals);
    let p = convert_to_float(pay_amount, pay_decimals);
    // 使用常数乘积算法计算接收资产的数量
    // Calculate `f(p)` to get `r`
    let bigr_times_p = big_r.mul(p);
    let bigp_plus_p = big_p.add(p);
    let r = bigr_times_p.div(bigp_plus_p);
    // 确保“r”不超过流动性
    if r > big_r {
        return Err(SwapProgramError::InvalidSwapNotEnoughLiquidity.into());
    }

    Ok(convert_from_float(r, receive_decimals))
}

// 将原始 value 除以 10^decimals，从而调整小数位。例如，10500 这个值在 decimals = 3（即 3 位小数）的情况下，会被转换成 10.5。
// 使用浮点数运算（f32）来保证计算精度，但可能会存在一定的浮点精度误差（这在金融计算中需要额外注意）
/// decimals would have a nominal balance of 10.5
fn convert_to_float(value: u64, decimals: u8) -> f32 {
    (value as f32).div(f32::powf(10.0, decimals as f32))
}

/// 通过使用其关联铸币的`decimals`值，将名义值（在这种情况下为计算值`r`）转换为`u64`，以得到用户将收到的铸币的实际数量。
///
/// 例如，如果`r`计算结果为10.5，该资产的实际数量
/// For example, if `r` is calculated to be 10.5, the real amount of the asset
/// to be received by the user is 10,500
fn convert_from_float(value: f32, decimals: u8) -> u64 {
    value.mul(f32::powf(10.0, decimals as f32)) as u64
}
