use anchor_lang::prelude::*;
#[error_code]
pub enum SwapProgramError {
    /// 某些算术运算导致结果数字对于 `u64` 值来说太大，从而导致溢出
    #[msg("An invalid asset mint address was provided.")]
    InvalidAssetKey,

    /// 用户提议的支付金额解析为 r 的值，该值超过了接收资产的池子代币账户余额。
    #[msg("The amount proposed to pay resolves to a receive amount that is greater than the current liquidity.")]
    InvalidSwapNotEnoughLiquidity,
    #[msg(
        "The amount proposed to pay is not great enough for at least 1 returned asset quantity."
    )]
    InvalidSwapNotEnoughPay,
    /// 用户请求进行“X换X”的交换操作 - 其中“X”的两个值均为
    /// 相同的资产铸币，这是不允许的
    #[msg("The asset proposed to pay is the same asset as the requested asset to receive.")]
    InvalidSwapMatchingAssets,
    /// 用户提议支付某项资产的0（金额）
    #[msg("A user cannot propose to pay 0 of an asset.")]
    InvalidSwapZeroAmount,
}
