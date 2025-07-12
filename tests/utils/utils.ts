import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// 从 umi-bundle-defaults 里导入 createUmi（带默认插件）
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';

// 从 umi 核心库单独导入身份管理
import { keypairIdentity, Umi, Signer, Keypair } from '@metaplex-foundation/umi';
import { Key } from 'readline';

/**
 * 创建 UMI 实例并绑定本地 Keypair 身份
 */
function loadUmiWithKeypair(
    rpcUrl: string,
    keypairPath: string
): { umi: Umi; keypair: Keypair } {
    if (keypairPath.startsWith('~')) {
        keypairPath = path.join(os.homedir(), keypairPath.slice(1));
    }

    if (!fs.existsSync(keypairPath)) {
        throw new Error(`Keypair file not found: ${keypairPath}`);
    }

    const secretKey = JSON.parse(fs.readFileSync(keypairPath, 'utf-8')) as number[];
    if (!Array.isArray(secretKey) || secretKey.length < 32) {
        throw new Error('Invalid keypair file');
    }

    // 创建 umi（自动加载默认插件，包括 rpc 和 eddsa）
    const umi = createUmi(rpcUrl);

    // 用 secret key 生成 keypair
    const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey));

    // 绑定身份
    umi.use(keypairIdentity(keypair));

    return { umi, keypair };
}
/**
 * 只传路径，读取本地 keypair 文件，返回 umi keypair 实例
 * @param keypairPath 本地文件路径，支持 ~
 * @returns umi keypair 实例
 */
function loadKeypairFromPath(keypairPath: string): Keypair {
    if (keypairPath.startsWith('~')) {
        keypairPath = path.join(os.homedir(), keypairPath.slice(1));
    }

    if (!fs.existsSync(keypairPath)) {
        throw new Error(`Keypair file not found: ${keypairPath}`);
    }

    const secretKey = JSON.parse(fs.readFileSync(keypairPath, 'utf-8')) as number[];
    if (!Array.isArray(secretKey) || secretKey.length < 32) {
        throw new Error('Invalid keypair file');
    }

    const umi = createUmi('https://api.devnet.solana.com'); // 临时 umi 实例，使用默认 devnet rpc
    const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey));

    return keypair;
}

export { loadUmiWithKeypair, loadKeypairFromPath };