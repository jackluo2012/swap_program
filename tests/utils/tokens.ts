import { percentAmount, generateSigner, keypairIdentity, Keypair } from '@metaplex-foundation/umi'
import { createAndMint, TokenStandard, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCore } from '@metaplex-foundation/mpl-core'

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