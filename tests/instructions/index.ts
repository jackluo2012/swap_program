import * as anchor from '@coral-xyz/anchor';
import { Keypair, PublicKey } from "@solana/web3.js";
import { SwapProgram } from "../../target/types/swap_program";
import { toBigIntQuantity } from "../utils/tokens";
export async function createPool(
    program: anchor.Program<SwapProgram>,
    payer: Keypair,
    poolAddress: PublicKey
): Promise<anchor.web3.TransactionSignature> {
    // solana 中所有的都是帐号包括 程序
    const tx = await program.methods
        .createPool()
        .accounts({
            pool: poolAddress,
            payer: payer.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([payer])
        .rpc();

    return tx;
}

//发送一个包含交换程序的“资金池”指令的交易。
/**
 * 注资池操作函数
 * 通过Anchor程序向指定流动性池注入代币资产
 * 
 * @param program - Anchor框架的SwapProgram实例
 * @param payer - 支付交易费用的密钥对
 * @param pool - 流动性池账户的公钥
 * @param mint - 代币铸造账户的公钥
 * @param quantity - 需要注入的代币数量（原始单位）
 * @param decimals - 代币精度位数（用于数量单位转换）
 * @returns 包含交易签名的Promise对象
 * 
 * 重要流程说明：
 * 1. 将数量转换为大整数格式并创建fundPool指令
 * 2. 构建交易账户参数对象：
 *    - 获取池账户的关联代币账户地址
 *    - 获取支付方的关联代币账户地址
 *    - 配置必要的程序账户地址
 * 3. 添加支付方签名者并发送RPC交易
 */
export async function funPool(
    program: anchor.Program<SwapProgram>,
    payer: Keypair,
    pool: PublicKey,
    mint: PublicKey,
    quantity: number,
    decimals: number,
): Promise<anchor.web3.TransactionSignature> {
    // 创建并发送注资交易
    const tx = await program.methods
        .fundPool(new anchor.BN(toBigIntQuantity(quantity, decimals).toString()))
        .accounts({
            pool: pool,
            mint: mint,
            payer: payer.publicKey,
            poolTokenAccount: await anchor.utils.token.associatedAddress({
                mint: mint,
                owner: pool,
            }),
            payerTokenAccount: await anchor.utils.token.associatedAddress({
                mint: mint,
                owner: payer.publicKey,
            }),
            tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
            associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
            systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([payer])
        .rpc();
    return tx;
}
/**
 * 执行代币交换操作的异步函数
 * 
 * @param program - Anchor程序实例，用于与区块链交互
 * @param payer - 交易支付者密钥对，用于支付交易费用和作为支付方
 * @param pool - 流动性池的公钥地址
 * @param receiveMint - 接收代币的代币铸造地址
 * @param payMint - 支付代币的代币铸造地址
 * @param quantity - 需要交换的代币数量（以人类可读的小数形式表示）
 * @param decimals - 代币的小数位数，用于将数量转换为链上整数格式
 * 
 * @returns 无返回值，但会抛出异常当交易失败时
 */
export async function swap(
    program: anchor.Program<SwapProgram>,
    payer: Keypair,
    pool: PublicKey,
    receiveMint: PublicKey,
    payMint: PublicKey,
    quantity: number,
    decimals: number,
) {
    /**
     * 调用链上swap指令并构建交易
     * 1. 将用户输入的数量转换为大整数格式（考虑小数位数）
     * 2. 配置交易所需的账户信息
     * 3. 添加支付者签名
     * 4. 发送RPC请求执行交易
     */
    await program.methods
        .swap(new anchor.BN(toBigIntQuantity(quantity, decimals).toString()))
        /**
         * 配置指令所需的账户集合：
         * - pool: 流动性池地址
         * - receiveMint: 接收代币的铸造地址
         * - payer: 支付者公钥
         * - poolTokenAccount: 池的接收代币关联账户
         * - payerTokenAccount: 支付者的支付代币关联账户
         * - payMint: 支付代币铸造地址
         * - tokenProgram: SPL Token程序地址
         * - associatedTokenProgram: 关联账户程序地址
         * - systemProgram: 系统程序地址
         */
        .accounts({
            pool: pool,
            receiveMint: receiveMint,
            payer: payer.publicKey,
            poolTokenAccount: await anchor.utils.token.associatedAddress({
                mint: receiveMint,
                owner: pool,
            }),
            payerTokenAccount: await anchor.utils.token.associatedAddress({
                mint: payMint,
                owner: payer.publicKey,
            }),
            payMint: payMint,
            tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
            associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
            systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([payer])
        /**
         * 发送交易到Solana网络执行
         * 使用rpc()方法进行远程过程调用
         */
        .rpc();
}