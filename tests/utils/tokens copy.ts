import { percentAmount, generateSigner, some, keypairIdentity, Keypair, PublicKey } from '@metaplex-foundation/umi'
import { createFungible, mintV1, TokenStandard, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCore } from '@metaplex-foundation/mpl-core'

import { createMintWithAssociatedToken, mplToolbox } from '@metaplex-foundation/mpl-toolbox'

/**
 * 用 UMI + MPL 创建可替代资产并铸造
 *
 * @param connection RPC URL
 * @param payer Web3 Keypair
 * @param mintKeypair Web3 Keypair
 * @param asset [name, symbol, description, uri, decimals, amount]
 * @param metadata 是否需要元数据 (Fungible 里通常都带)
 */
export async function mintNewTokens(
    connection: string,
    payer: Keypair,
    mintKeypair: Keypair,
    asset: [string, string, string, string, number, number],
    metadata: boolean
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

    // 3️⃣ 创建可替代资产
    const { signature, result } = await createFungible(umi, {
        mint,
        authority: umi.identity,
        name,
        symbol,
        uri,
        sellerFeeBasisPoints: percentAmount(0), // 可选，如果你想要版税可以改成 500 = 5%
        decimals,
    }).sendAndConfirm(umi);
    console.log(`${signature.toString()}`);
    console.log(`✅ Fungible asset created: ${result.value}`);
    console.log(`✅ Fungible asset created: ${mint.publicKey}`);

    // 4️⃣ 使用 mintV1 铸造
    await mintV1(umi, {
        mint: mint.publicKey,
        authority: umi.identity,
        amount: amount,
        tokenOwner: payer.publicKey,
        tokenStandard: TokenStandard.NonFungible,
    }).sendAndConfirm(umi)


    // await createMintWithAssociatedToken(umi, {
    //     mint,
    //     owner: payer.publicKey,
    //     amount: amount,
    // }).sendAndConfirm(umi)

    return mint.publicKey.toString();
}