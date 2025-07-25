import * as anchor from '@coral-xyz/anchor';
import { Keypair, PublicKey } from "@solana/web3.js";
import { SwapProgram } from "../../target/types/swap_program";
import { toBigIntQuantity } from "../utils/tokens";
export async function createPool(
    program: anchor.Program<SwapProgram>,
    payer: Keypair,
    poolAddress: PublicKey
): Promise<anchor.web3.TransactionSignature> {
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
export async function funPool(
    program: anchor.Program<SwapProgram>,
    payer: Keypair,
    pool: PublicKey,
    mint: PublicKey,
    quantity: number,
    decimals: number,
): Promise<anchor.web3.TransactionSignature> {
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
export async function swap(
    program: anchor.Program<SwapProgram>,
    payer: Keypair,
    pool: PublicKey,
    receiveMint: PublicKey,
    payMint: PublicKey,
    quantity: number,
    decimals: number,
) {
    await program.methods
        .swap(new anchor.BN(toBigIntQuantity(quantity, decimals).toString()))
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
        .rpc();
}