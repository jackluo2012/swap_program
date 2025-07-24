use anchor_lang::prelude::*;

use crate::{error::*, state::*};

use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{self, Mint, MintTo, TokenAccount, TokenInterface},
};
/// 通过用某种资产为资金池注资，为其提供流动性。
pub fn fund_pool(ctx: Context<FundPool>, amount: u64) -> Result<()> {
    let pool = &mut ctx.accounts.pool;

    // Deposit: (From,To,amount)
    let deposit = (
        &ctx.accounts.mint,
        &ctx.accounts.payer_token_account,
        &ctx.accounts.pool_token_account,
        amount,
    );
    pool.fund(
        deposit,
        &ctx.accounts.payer,
        &ctx.accounts.system_program,
        &ctx.accounts.token_program,
    )
}

#[derive(Accounts)]
pub struct FundPool<'info> {
    /// 流动池 liquiditypool ,理论已经初始化了
    #[account(mut,
        seeds = [LiquidityPool::SEED_PREFIX],
        bump = pool.bump
    )]
    pub pool: Account<'info, LiquidityPool>,
    /// 存入资金池中的mint 帐户
    pub mint: InterfaceAccount<'info, Mint>,
    /// 存入资金池的资产的流动性资金池通证账户
    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = pool,
    )]
    pub pool_token_account: InterfaceAccount<'info, TokenAccount>,
    /// 支付方（即流动性提供者）用于存入资金池的资产的代币账户  
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = payer,
    )]
    pub payer_token_account: InterfaceAccount<'info, TokenAccount>,
    // 付款方 / 流动性提供者
    #[account(mut)]
    pub payer: Signer<'info>,

    /// 关联的 SPL Token 程序
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,

    /// 系统程序
    pub system_program: Program<'info, System>,
}
