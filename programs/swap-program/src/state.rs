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

    /// 向账户中添加资产，若资产已存在则直接返回成功，若不存在则重新分配空间后添加
    ///
    /// # 参数
    /// * `&mut self` - 账户结构体的可变引用，用于修改内部状态
    /// * `key` - 要添加的资产公钥标识符
    /// * `payer` - 支付者签名者，用于支付系统操作费用
    /// * `system_program` - 系统程序引用，用于执行系统指令
    ///
    /// # 返回值
    /// 返回 `Result<()>` 类型，表示操作结果：
    /// - `Ok(())` 表示成功完成资产添加
    /// - `Err(E)` 表示操作过程中发生错误（如内存分配失败）
    ///
    /// # 行为说明
    /// 1. 首先通过 `check_asset_key` 验证资产是否存在
    /// 2. 若资产存在则直接返回成功
    /// 3. 若资产不存在则执行以下操作：
    ///    - 调用 `realloc` 扩展账户内存空间
    ///    - 将新资产公钥推入 `assets` 向量
    fn add_asset(
        &mut self,
        key: Pubkey,
        payer: &Signer<'info>,
        system_program: &Program<'info, System>,
    ) -> Result<()> {
        // 资产存在性检查与添加逻辑分支
        match self.check_asset_key(&key) {
            Ok(()) => {
                // 资产已存在，执行添加逻辑
            }
            Err(_) => {
                // 资产不存在时的处理流程
                self.realloc(32, payer, system_program)?;
                self.assets.push(key);
            }
        }
        Ok(())
    }
    /// 重新分配账户大小以适应数据大小的变化。在本程序中，
    /// 当通过向铸币地址的向量（`Vec<Pubkey>`）中推送一个 `Pubkey` 来增加其大小时，
    /// 此函数用于重新分配流动性池的账户。
    ///
    /// 该函数会根据需要增加的空间大小，计算所需的租金，并从支付者账户转移相应的资金，
    /// 然后调整账户的大小以容纳新的数据。
    ///
    /// # 参数
    /// * `space_to_add` - 需要增加的账户空间大小（以字节为单位）
    /// * `payer` - 支付额外租金的账户签名者
    /// * `system_program` - 系统程序的引用，用于执行转账操作
    ///
    /// # 返回值
    /// * `Result<()>` - 操作成功返回Ok，否则返回相应的错误
    fn realloc(
        &mut self,
        space_to_add: usize,
        payer: &Signer<'info>,
        system_program: &Program<'info, System>,
    ) -> Result<()> {
        let account_info = self.to_account_info();
        let new_account_size = account_info.data_len() + space_to_add;

        // 计算重新分配账户大小所需的租金
        let lamports_required = Rent::get()?.minimum_balance(new_account_size);
        // 检查账户是否需要补充资金以满足新的租金要求
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

        // 调整账户大小到新的尺寸
        account_info.resize(new_account_size)?;
        Ok(())
    }
    /// 通过将资产从付款人（或流动性提供者）的代币账户转移到流动性池的代币账户，为流动性池提供资金。
    /// 在这个函数中，如果铸币地址不存在，程序还会将其添加到存储在 `LiquidityPool`
    ///  数据中的铸币地址列表中，并重新分配账户大小。

    /// 向池中存入资金
    ///
    /// 此函数处理将一定数量的代币从付款人的账户转移到池的账户中
    /// 它涉及两个主要步骤: 首先，通过调用`add_asset`方法将资产添加到池中
    /// 其次，通过调用`process_transfer_to_pool`方法处理实际的代币转移
    ///
    /// # 参数
    ///
    /// * `deposit` - 包含要存入的代币的相关信息，包括代币的薄荷、付款人的代币账户、池的代币账户和存入金额
    /// * `authority` - 操作的授权方，必须是代币账户的拥有者
    /// * `system_program` - Solana系统程序的引用
    /// * `token_program` - 代币程序的接口引用，用于执行代币操作
    ///
    /// # 返回值
    ///
    /// 如果操作成功，返回`Ok(())`，否则返回错误
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
        // 解构deposit元组为各个组成部分
        let (mint, payer_token_account, pool_token_account, amount) = deposit;

        // 将资产添加到池中，这一步确保池能够识别和管理存入的代币
        self.add_asset(mint.key(), authority, system_program)?;

        // 处理将资产从付款人代币账户转移到池的代币账户
        // 这是通过调用代币程序来完成实际的代币转移
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
    ///
    /// 该函数执行资产互换操作，包括验证资产、计算兑换金额以及执行代币转移。
    ///
    /// # 参数
    /// * `receive` - 接收资产的相关账户元组，包含：
    ///   - Mint账户：接收资产的铸币账户
    ///   - TokenAccount：池子的接收资产代币账户
    ///   - TokenAccount：付款人的接收资产代币账户
    /// * `pay` - 支付资产的相关账户元组，包含：
    ///   - Mint账户：支付资产的铸币账户
    ///   - TokenAccount：付款人的支付资产代币账户
    ///   - TokenAccount：池子的支付资产代币账户
    ///   - u64：支付的资产数量
    /// * `authority` - 签名者账户，用于授权转移操作
    /// * `token_program` - 代币程序接口，用于执行代币操作
    ///
    /// # 返回值
    /// * `Result<()>` - 操作成功返回Ok，失败返回相应的错误
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
        // 解构接收资产的账户信息并验证资产密钥
        let (receive_mint, pool_recieve, payer_recieve) = receive;
        self.check_asset_key(&receive_mint.key())?;
        let (pay_mint, payer_pay, pool_pay, pay_amount) = pay;
        self.check_asset_key(&pay_mint.key())?;

        // 确定付款人将收到的所请求资产的金额
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
///
/// # 参数
/// * [mint](file://d:\works\learn\rust\solana\swap-program\tests\utils\tokens.ts#L29-L29) - 代币铸造账户的接口账户引用
/// * `from` - 转出方代币账户的接口账户引用
/// * `to` - 转入方代币账户的接口账户引用
/// * `amount` - 要转移的代币数量
/// * `authority` - 授权签名者的账户引用
/// * `token_program` - 代币程序的接口引用
///
/// # 返回值
/// * `Result<()>` - 操作成功返回 Ok(())，失败返回相应的错误
fn process_transfer_to_pool<'info>(
    mint: &InterfaceAccount<'info, Mint>,
    from: &InterfaceAccount<'info, TokenAccount>,
    to: &InterfaceAccount<'info, TokenAccount>,
    amount: u64,
    authority: &Signer<'info>,
    token_program: &Interface<'info, TokenInterface>,
) -> Result<()> {
    // 获取该铸造账户的小数位数
    let decimals = mint.decimals;

    // 创建 TransferChecked 结构体，包含所需的账户信息
    let cpi_accounts = TransferChecked {
        mint: mint.to_account_info(),
        from: from.to_account_info(),
        to: to.to_account_info(),
        authority: authority.to_account_info(),
    };

    // 获取 CPI 调用的目标程序
    let cpi_program = token_program.to_account_info();

    // 将账户和程序组合成 CPI 上下文
    let cpi_context = CpiContext::new(cpi_program, cpi_accounts);

    // 执行 CPI 调用，调用代币程序的 transfer_checked 指令
    token_interface::transfer_checked(cpi_context, amount, decimals)?;
    Ok(())
}
/// 使用带有签名者种子的 CPI，将资金从池子的代币账户转移到支付者的代币账户
///
/// # 参数
/// * [mint](file://d:\works\learn\rust\solana\swap-program\tests\utils\tokens.ts#L29-L29) - 代币铸造账户，用于验证代币信息
/// * `from` - 源代币账户，资金将从该账户转出
/// * `to` - 目标代币账户，资金将转入该账户
/// * `amount` - 转账的代币数量
/// * `pool` - 流动性池账户，作为转账的授权方
/// * `token_program` - 代币程序接口，用于执行转账操作
///
/// # 返回值
/// * `Result<()>` - 操作成功返回 Ok(())，失败返回相应的错误信息
fn process_transfer_from_pool<'info>(
    mint: &InterfaceAccount<'info, Mint>,
    from: &InterfaceAccount<'info, TokenAccount>,
    to: &InterfaceAccount<'info, TokenAccount>,
    amount: u64,
    pool: &Account<'info, LiquidityPool>,
    token_program: &Interface<'info, TokenInterface>,
) -> Result<()> {
    // 构造签名者种子，用于 CPI 调用时的权限验证
    let signer_seeds: &[&[&[u8]]] = &[&[LiquidityPool::SEED_PREFIX, &[pool.bump]]];

    let decimals = mint.decimals;

    // 构造转账检查所需的 CPI 账户信息
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
/// 计算交换操作中接收方应获得的资产数量
///
/// 该函数使用常数乘积算法来确定在给定支付金额的情况下，
/// 用户应该接收多少目标资产。同时确保交换不会超出池中的流动性限制。
///
/// # 参数
/// * `pool_recieve_balance` - 接收资产在池中的余额
/// * `receive_decimals` - 接收资产的小数位数
/// * `pool_pay_balance` - 支付资产在池中的余额
/// * `pay_decimals` - 支付资产的小数位数
/// * `pay_amount` - 用户支付的资产数量
///
/// # 返回值
/// * `Result<u64>` - 成功时返回应接收的资产数量，失败时返回错误
///
/// # 错误
/// * `SwapProgramError::InvalidSwapNotEnoughLiquidity` - 当请求的交换量超出流动性时返回
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
    // Calculate `f(p)` to get [r](file://d:\works\learn\rust\solana\swap-program\node_modules\prettier)
    let bigr_times_p = big_r.mul(p);
    let bigp_plus_p = big_p.add(p);
    let r = bigr_times_p.div(bigp_plus_p);

    // 确保"r"不超过流动性
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
