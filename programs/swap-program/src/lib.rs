use anchor_lang::prelude::*;

declare_id!("6wxKPhohXcTb6VqfaU6P7hfL77PmzbS7TxV4C1ctbkMA");

#[program]
pub mod swap_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
