import { percentAmount, generateSigner, keypairIdentity, Keypair } from '@metaplex-foundation/umi'
import { createAndMint, TokenStandard, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCore } from '@metaplex-foundation/mpl-core'
import { Connection, PublicKey, Keypair as Web3Keypair } from '@solana/web3.js';
import { getAssociatedTokenAddressSync, createMintToInstruction } from '@solana/spl-token';
import { buildTransaction } from './transaction';
import * as anchor from "@coral-xyz/anchor";
/**
 * 用 UMI + MPL 创建可替代资产并铸造
 *
 * @param connection RPC URL
 * @param payer Web3 Keypair
 * @param asset [name, symbol, description, uri, decimals, amount]
 */

export async function mintNewTokens(
    connection: string,
    payer: Keypair,
    asset: [string, string, string, string, number, number],
) {
    console.log(`Minting new tokens...`);

    // 1️⃣ 创建 UMI 实例
    const umi = createUmi(connection).use(mplCore()).use(keypairIdentity(payer))
    // ✅ 注册 mpl-token-metadata 插件
    umi.use(mplTokenMetadata());
    console.log(umi.rpc.getEndpoint())
    // 2️⃣ 生成 Mint signer
    const mint = generateSigner(umi);
    const [name, symbol, description, uri, decimals, amount] = asset;
    // 创建 并铸造 代币
    const { signature, result } = await createAndMint(umi, {
        mint,
        authority: umi.identity,
        name: name,
        symbol: symbol,
        uri: uri,
        sellerFeeBasisPoints: percentAmount(0),
        decimals: decimals,
        amount: amount,
        tokenOwner: payer.publicKey,
        tokenStandard: TokenStandard.Fungible,
    }).sendAndConfirm(umi);
    console.log(`Minted new tokens with signature: ${signature}`);
    console.log(`Minted new tokens with result: ${result}`);

    return mint.publicKey.toString();
}

export function toBigIntQuantity(quantity: number, decimals: number): bigint {
    return BigInt(quantity) * BigInt(10) ** BigInt(decimals)
}

export function fromBigIntQuantity(quantity: bigint, decimals: number): string {
    return (Number(quantity) / 10 ** decimals).toFixed(6)
}

// 将现有的SPL代币铸造到本地密钥对
export async function mintExistingTokens(
    connection: Connection,
    payer: Web3Keypair,
    mint: PublicKey,
    quantity: number,
    decimals: number
): Promise<anchor.web3.TransactionSignature> {
    const tokenAccount = getAssociatedTokenAddressSync(mint, payer.publicKey);
    const mintToWalletIx = createMintToInstruction(
        mint,
        tokenAccount,
        payer.publicKey,
        toBigIntQuantity(quantity, decimals)
    );
    const tx = await buildTransaction(
        connection,
        payer.publicKey,
        [mintToWalletIx],
        [payer]
    )
    return await connection.sendTransaction(tx)
}
