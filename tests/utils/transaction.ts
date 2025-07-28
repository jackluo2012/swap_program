import { Connection, PublicKey, Keypair, TransactionInstruction, TransactionMessage, VersionedTransaction } from "@solana/web3.js";


/**
 * 构建一个交易
 * 
 * 此函数异步地构建一个包含多个指令的交易它首先获取最新的区块哈希，
 * 然后创建一个交易消息，最后收集所有签名者对交易的签名
 * 
 * @param connection 到Solana网络的连接
 * @param payer 交易费用的支付者公钥
 * @param instructions 交易中包含的所有指令
 * @param signers 交易的签名者数组
 * @returns 返回一个签名后的交易对象
 */
export async function buildTransaction(
    connection: Connection,
    payer: PublicKey,
    instructions: TransactionInstruction[],
    signers: Keypair[]
): Promise<VersionedTransaction> {
    // 获取最新的区块哈希，用于构建交易
    let blockhash = await connection.getLatestBlockhash().then((res) => res.blockhash);

    // 创建并编译交易消息
    const messageV0 = new TransactionMessage({
        payerKey: payer,
        recentBlockhash: blockhash,
        instructions,
    }).compileToV0Message();

    // 创建版本化交易对象并添加签名
    const tx = new VersionedTransaction(messageV0);
    signers.forEach((s) => tx.sign([s]));

    // 返回签名后的交易
    return tx
}