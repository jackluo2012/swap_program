import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SwapProgram } from "../../target/types/swap_program";

import { Connection, PublicKey } from "@solana/web3.js";
import {
    Account as TokenAccount,
    getAccount as getTokenAccount,
    TOKEN_2022_PROGRAM_ID,
    getAssociatedTokenAddressSync,
    getMultipleAccounts as getMultipleTokenAccounts,

} from "@solana/spl-token";
import { get } from "http";
import { fromBigIntQuantity } from "./tokens";

// 用于获取流动性池的函数
/**
 * 获取指定地址的流动性池信息
 * 
 * @param program - Anchor程序实例，用于与链上程序交互
 * @param poolAddress - 流动性池的公钥地址
 * @returns 返回指定地址的流动性池账户数据
 */
export async function fetchPool(
    program: anchor.Program<SwapProgram>,
    poolAddress: PublicKey
): Promise<anchor.IdlTypes<anchor.Idl>['LiquidityPool']> {
    // 通过程序实例获取流动性池账户数据
    return program.account.liquidityPool.fetch(
        poolAddress
    ) as anchor.IdlTypes<anchor.Idl>['LiquidityPool']
}

// 从流动性池存储的铸币地址列表中获取所有拥有的代币账户
/**
 * 获取流动性池的代币账户信息
 * 
 * @param connection - Solana网络连接对象
 * @param poolAddress - 流动性池的公钥地址
 * @param pool - 流动性池的IDL类型数据，包含资产信息
 * @returns 返回流动性池相关的代币账户数组
 */
export async function fetchPoolTokenAccounts(
    connection: Connection,
    poolAddress: PublicKey,
    pool: anchor.IdlTypes<anchor.Idl>['LiquidityPool']
): Promise<TokenAccount[]> {

    // 根据池子的资产信息生成关联代币地址
    const tokenAddresses = pool.assets.map((mint) => getAssociatedTokenAddressSync(
        mint,
        poolAddress,
        true
    ));

    // 批量获取代币账户信息
    return getMultipleTokenAccounts(
        connection,
        tokenAddresses,
    );
}

// 计算常数乘积K（常数乘积算法）
/**
 * 计算常数乘积做市商模型中的K值
 * 该函数通过将所有代币账户的余额相乘来计算恒定乘积
 * 
 * @param tokenAccounts - 代币账户数组，每个账户包含代币余额信息
 * @returns 返回所有账户余额的乘积，表示恒定乘积做市商模型中的K值
 */
export function calculateConstantProductK(
    tokenAccounts: TokenAccount[]
): bigint {
    // 将所有代币账户的余额相乘，计算恒定乘积K值
    return tokenAccounts.map((account) => account.amount).reduce((product, i) => product * i)
}

export async function calculateBalances(
    connection: Connection,
    owner: PublicKey,
    pool: PublicKey,
    receiveAddress: PublicKey,
    receiveDecimals: number,
    payAddress: PublicKey,
    payDecimals: number

): Promise<[string, string, string, string]> {
    // 获取接收方的代币账户
    const receiveUserTokenAccount = await getTokenAccount(
        connection,
        getAssociatedTokenAddressSync(receiveAddress, owner),
    );
    // 获取支付方的代币账户
    const receiveUserBalance = fromBigIntQuantity(
        receiveUserTokenAccount.amount,
        receiveDecimals
    );
    // 获取支付方的代币账户
    const payUserTokenAccount = await getTokenAccount(
        connection,
        getAssociatedTokenAddressSync(payAddress, owner),
    );
    // 获取支付方的余额
    const payUserBalance = fromBigIntQuantity(
        payUserTokenAccount.amount,
        payDecimals
    );
    // 获取流动性池的代币账户
    const receivePoolTokenAccount = await getTokenAccount(
        connection,
        getAssociatedTokenAddressSync(receiveAddress, pool, true),
    );
    // 获取流动性池的余额
    const receivePoolBalance = fromBigIntQuantity(
        receivePoolTokenAccount.amount,
        receiveDecimals
    );
    // 获取流动性池的支付方代币账户
    const payPoolTokenAccount = await getTokenAccount(
        connection,
        getAssociatedTokenAddressSync(payAddress, pool, true),
    );
    // 获取流动性池的支付方余额
    const payPoolBalance = fromBigIntQuantity(
        payPoolTokenAccount.amount,
        payDecimals
    );

    return [
        receiveUserBalance,
        receivePoolBalance,
        payUserBalance,
        payPoolBalance,
    ];
}

export function calculateChangeInK(start: bigint, end: bigint): string {
    const startNum = Number(start)
    const endNum = Number(end)
    if (startNum === 0) {
        throw new Error("cannot calculate percent change for a zero value.")
    }
    const change = endNum - startNum
    const percentChange = (change / startNum) * 100
    return percentChange.toFixed(4) + '%'

}