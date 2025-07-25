use anchor_lang::prelude::*;
pub mod error;
pub mod instructions;
pub mod state;
use instructions::*;

declare_id!("4yCxmVu65qfVi4wreCW58yudn8Mz41LJ8yTMUXeoPUTB");

#[program]
pub mod swap_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

    // 创建 初始化liquidity pool
    pub fn create_pool(ctx: Context<CreatePool>) -> Result<()> {
        instructions::create_pool(ctx)
    }
    /// 通过投入某种资产为资金池提供流动性
    pub fn fund_pool(ctx: Context<FundPool>, amount: u64) -> Result<()> {
        instructions::fund_pool(ctx, amount)
    }
    // 使用去中心化交易所（DEX）交换资产

    pub fn swap(ctx: Context<Swap>, amount_to_swap: u64) -> Result<()> {
        instructions::swap(ctx, amount_to_swap)
    }
}

#[derive(Accounts)]
pub struct Initialize {}
