import {
    keypairIdentity,
} from '@metaplex-foundation/umi'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import fs from 'fs'
import path from 'path'
import os from 'os'
import { readFileSync } from 'fs'

describe("[运行脚本设置]: 上传资源", () => {
    // 资源列表 
    const assets = [
        ['Cannon', 'CAN', 'A cannon for defending yer ship!', './assets/cannon.png', 'cannon.png'],
        ['Cannon Ball', 'CANB', 'Cannon balls for yer cannons!', './assets/cannon-ball.png', 'cannon-ball.png'],
        ['Compass', 'COMP', 'A compass to navigate the seven seas!', './assets/compass.png', 'compass.png'],
        ['Fishing Net', 'FISH', 'A fishing net for catching meals for the crew!', './assets/fishing-net.png', 'fishing-net.png'],
        ['Gold', 'GOLD', 'Ahh the finest gold in all of these waters!', './assets/coin1-tp.png', 'coin1-tp.png'],
        ['Grappling Hook', 'GRAP', 'A grappling hook for boarding other ships!', './assets/grappling-hook.png', 'grappling-hook.png'],
        ['Gunpowder', 'GUNP', 'Gunpowder for ye muskets!', './assets/gunpowder.png', 'gunpowder.png'],
        ['Musket', 'MUSK', 'A musket for firing on enemies!', './assets/musket.png', 'musket.png'],
        ['Rum', 'RUM', 'Rum, more rum!', './assets/rum.png', 'rum.png'],
        ['Telescope', 'TELE', 'A telescope for spotting booty amongst the seas!', './assets/telescope.png', 'telescope.png'],
        ['Treasure Map', 'TMAP', 'A map to help ye find long lost treasures!', './assets/treasure-map-1.png', 'treasure-map-1.png'],
    ]
    type UploadParams = [string, string, string, string, string]
    // 设置休眠时间
    const sleepSeconds = async (seconds: number) => await new Promise(resolve => setTimeout(resolve, seconds * 1000));
    async function uploadToArweave(
        args: UploadParams,
        keypairPath = '~/.config/solana/id.json',
        rpcUrl = 'https://api.devnet.solana.com'
    ): Promise<{ imageUri: string; metadataUri: string }> {
        const [name, symbol, description, imagePath, imageFileName] = args

        // 👇 处理 `~` 路径
        if (keypairPath.startsWith('~')) {
            keypairPath = path.join(os.homedir(), keypairPath.slice(1))
        }

        // 👉 初始化 umi 实例
        const umi = createUmi(rpcUrl)

        // 👉 加载本地钱包
        const secretKey = JSON.parse(fs.readFileSync(keypairPath, 'utf-8')) as number[]
        const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey))
        umi.use(keypairIdentity(keypair))

        // 👉 使用 Irys uploader
        umi.use(irysUploader())

        // 👉 上传图片
        const imageBuffer = readFileSync(imagePath)
        const [imageUri] = await umi.uploader.upload([
            {
                buffer: imageBuffer,
                fileName: imageFileName,
                contentType: 'image/png', // 可按需支持 jpg 等
                displayName: imageFileName,
                uniqueName: `${Date.now()}-${imageFileName}`,
                extension: path.extname(imageFileName).replace('.', ''),
                tags: [],
            },
        ])
        console.log('✅ 图片上传成功:', imageUri)

        // 👉 构造 Metadata 并上传
        const metadata = {
            name,
            symbol,
            description,
            image: imageUri,
        }

        const [metadataUri] = await umi.uploader.upload([
            {
                buffer: Buffer.from(JSON.stringify(metadata)),
                fileName: 'metadata.json',
                contentType: 'application/json',
                displayName: 'metadata.json',
                uniqueName: `${Date.now()}-metadata.json`,
                extension: 'json',
                tags: [],
            },
        ])

        console.log('✅ Metadata 上传成功:', metadataUri)

        return { imageUri, metadataUri }
    }
    // 上传assets 中的资源 
    for (const a of assets) {
        it(`上传资源: ${a[0]}`, async () => {
            const { imageUri, metadataUri } = await uploadToArweave(a as UploadParams)
            console.log('imageUri:', imageUri)
            console.log('metadataUri:', metadataUri)
            await sleepSeconds(5)
        });
    }
});
