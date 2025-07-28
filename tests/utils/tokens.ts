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

/**
 * 将数字转换为指定小数位数的BigInt表示
 * 
 * 该函数通过将输入数值乘以10的decimals次方，将浮点数转换为具有指定精度的整数形式BigInt。
 * 常用于处理加密货币金额或需要精确小数运算的场景。
 * 
 * @param quantity - 要转换的基础数值（可为浮点数）
 * @param decimals - 小数位数精度（需为非负整数）
 * @returns 转换后的BigInt值，表示放大后的整数金额
 */
export function toBigIntQuantity(quantity: number, decimals: number): bigint {
    return BigInt(quantity) * BigInt(10) ** BigInt(decimals)
}

export function fromBigIntQuantity(quantity: bigint, decimals: number): string {
    return (Number(quantity) / 10 ** decimals).toFixed(6)
}

// 将现有的SPL代币铸造到本地密钥对
/**
 * 铸造已存在的代币到指定的钱包地址。
 * 
 * 此函数通过指定的铸币地址（mint address）和钱包地址（wallet address），
 * 铸造指定数量的代币到该钱包地址中。函数首先获取与铸币地址和钱包地址
 * 关联的代币账户地址，然后创建一个铸造指令，最后将该指令打包到交易中
 * 并发送。
 * 
 * @param connection - 与Solana网络的连接。
 * @param payer - 交易的支付方，包含公钥和私钥。
 * @param mint - 代币的铸币地址。
 * @param quantity - 要铸造的代币数量。
 * @param decimals - 代币的小数位数。
 * @returns 返回交易的签名。
 */
export async function mintExistingTokens(
    connection: Connection,
    payer: Web3Keypair,
    mint: PublicKey,
    quantity: number,
    decimals: number
): Promise<anchor.web3.TransactionSignature> {
    // 根据 铸币帐号的mint 地址，和 钱包地址，获取，关联 代币的地址。
    const tokenAccount = getAssociatedTokenAddressSync(mint, payer.publicKey);

    // 创建铸造指令，将代币铸造到关联的代币账户中。
    const mintToWalletIx = createMintToInstruction(
        mint,
        tokenAccount,
        payer.publicKey,
        toBigIntQuantity(quantity, decimals)
    );

    // 构建交易，包含铸造指令，并使用支付方的密钥对交易进行签名。
    const tx = await buildTransaction(
        connection,
        payer.publicKey,
        [mintToWalletIx],
        [payer]
    )

    // 发送交易并返回交易签名。
    return await connection.sendTransaction(tx)
}
