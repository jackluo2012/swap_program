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
export async function fetchPool(
    program: anchor.Program<SwapProgram>,
    poolAddress: PublicKey
): Promise<anchor.IdlTypes<anchor.Idl>['LiquidityPool']> {
    return program.account.liquidityPool.fetch(
        poolAddress
    ) as anchor.IdlTypes<anchor.Idl>['LiquidityPool']
}

// 从流动性池存储的铸币地址列表中获取所有拥有的代币账户
export async function fetchPoolTokenAccounts(
    connection: Connection,
    poolAddress: PublicKey,
    pool: anchor.IdlTypes<anchor.Idl>['LiquidityPool']
): Promise<TokenAccount[]> {

    const tokenAddresses = pool.assets.map((mint) => getAssociatedTokenAddressSync(
        mint,
        poolAddress,
        true
    ));

    return getMultipleTokenAccounts(
        connection,
        tokenAddresses,
    );
}

// 计算常数乘积K（常数乘积算法）
export function calculateConstantProductK(
    tokenAccounts: TokenAccount[]
): bigint {
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