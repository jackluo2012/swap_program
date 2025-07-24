use crate::error::*;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

pub fn swap(ctx: Context<Swap>, amount_to_swap: u64) -> Result<()> {
    // 检查金额是否为0
    if amount_to_swap == 0 {
        return Err(SwapProgramError::InvalidSwapZeroAmount.into());
    }
    let pool = &mut ctx.accounts.pool;
    // 接收：用户请求接收以作交换的资产：
    // (Mint, From, To)
    let receive = (
        &ctx.accounts.receive_mint,
        &ctx.accounts.pool_receive_token_account,
        &ctx.accounts.payer_receive_token_account,
    );
    // 支付：用户提议在掉期中支付的资产：
    // (Mint, From, To, Amount)
    let pay = (
        &ctx.accounts.pay_mint,
        &ctx.accounts.payer_pay_token_account,
        &ctx.accounts.pool_pay_token_account,
        amount_to_swap,
    );
    pool.process_swap(
        receive,
        pay,
        &ctx.accounts.payer,
        &ctx.accounts.token_program,
    )
}

#[derive(Accounts)]
pub struct Swap<'info> {
    /// Liquidity Pool
    #[account(
        mut,
        seeds = [LiquidityPool::SEED_PREFIX],
        bump = pool.bump
    )]
    pub pool: Account<'info, LiquidityPool>,
    /// 用户请求接收以作交换的资产的铸币账户
    #[account(
        constraint = !receive_mint.key().eq(&pay_mint.key()) @ SwapProgramError::InvalidSwapMatchingAssets,
    )]
    pub receive_mint: InterfaceAccount<'info, Mint>,
    /// 流动性池的代币账户，用于存放用户请求接收以作交换的资产（该账户将被扣除相应资产）的铸币。
    #[account(
        mut,
        associated_token::mint = receive_mint,
        associated_token::authority = pool,
    )]
    pub pool_receive_token_account: InterfaceAccount<'info, TokenAccount>,
    /// 用户请求接收以作交换（将记入贷方）的资产铸币所对应的用户代币账户
    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = receive_mint,
        associated_token::authority = payer,
    )]
    pub payer_receive_token_account: InterfaceAccount<'info, TokenAccount>,
    pub pay_mint: InterfaceAccount<'info, Mint>,
    /// 用户提议在掉期中支付的资产铸币对应的流动性池代币账户（该账户将被贷记）
    #[account(
        mut,
        associated_token::mint = pay_mint,
        associated_token::authority = pool,
    )]
    pub pool_pay_token_account: InterfaceAccount<'info, TokenAccount>,
    /// 用户提议在掉期交易中支付的资产铸币（将被借记）的用户代币账户
    #[account(
        mut,
        associated_token::mint = pay_mint,
        associated_token::authority = payer,
    )]
    pub payer_pay_token_account: InterfaceAccount<'info, TokenAccount>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}
