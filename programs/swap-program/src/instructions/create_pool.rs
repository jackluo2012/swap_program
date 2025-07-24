use anchor_lang::prelude::*;

use crate::state::*;

pub fn create_pool(ctx: Context<CreatePool>) -> Result<()> {
    msg!("Creating liquidity pool...");
    // 初始化 liquiditypool state
    ctx.accounts
        .pool
        .set_inner(LiquidityPool::new(ctx.bumps.pool));

    Ok(())
}

#[derive(Accounts)]
pub struct CreatePool<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    /// 流动池 liquiditypool
    #[account(
        init,
        payer = payer,
        space = LiquidityPool::INIT_SPACE,
        seeds = [LiquidityPool::SEED_PREFIX],
        bump
    )]
    pub pool: Account<'info, LiquidityPool>,
    /// 系统程序
    pub system_program: Program<'info, System>,
}
