
import * as anchor from "@coral-xyz/anchor";
import { Keypair } from '@solana/web3.js'
import { loadKeypairFromPath } from './utils/utils'
import { mintNewTokens } from './utils/tokens'
import { ASSETS } from './utils/const';
import fs from 'fs'
describe("[运行脚本设置]: 创建资产", async () => {
    const provider = anchor.AnchorProvider.env()
    const rpcurl = provider.connection.rpcEndpoint
    const payer = loadKeypairFromPath('~/.config/solana/id.json')
    it('创建资产代币', async () => {
        let assets_conf = {
            assets: [],
        }

        for (const a of ASSETS) {
            //生成资产代币和铸造代币
            const mintStr = await mintNewTokens(
                rpcurl,
                payer,
                a
            )
            assets_conf.assets.push({
                name: a[0],
                symbol: a[1],
                description: a[2],
                uri: a[3],
                decimals: a[4],
                quantity: a[5],
                address: mintStr,
            })
        }
        // 写入文件中，
        fs.writeFileSync(
            './tests/utils/assets.json',
            JSON.stringify(assets_conf, null, 2),
            'utf-8'
        )
    });


    console.log(provider.connection.rpcEndpoint);

    // const umi = createUmi(provider.connection.rpcEndpoint).use(mplCore())
    const kp = loadKeypairFromPath('~/.config/solana/id.json')
    console.log(kp.publicKey.toString())

});
