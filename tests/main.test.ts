import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SwapProgram } from "../target/types/swap_program";
import assetsConfig from "./utils/assets.json";
import { PublicKey } from "@solana/web3.js";

import { createPool, funPool, swap } from "./instructions";
import { fetchPool, fetchPoolTokenAccounts, calculateConstantProductK, calculateChangeInK } from "./utils/swap";
import { mintExistingTokens } from "./utils/tokens";

import {
    logChangeInK,
    logK,
    logPool,
    logPostSwap,
    logPreSwap,
} from './utils/log'

// Send prefix for the Liquidity pool from our program
const LIQUIDITY_POOL_SEED_PREFIX = "liquidity_pool";
// 用于休眠的工具函数
const sleepSeconds = async (s: number) =>
    await new Promise((f) => setTimeout(f, s * 1000))

// 生成小于最大值的随机数的实用函数
function getRandomInt(max: number): number {
    return Math.floor(Math.random() * max)
}

describe("[Running Unit Tests]: Swap Program", async () => {
    // Configure the client to use the local cluster.
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.swapProgram as Program<SwapProgram>;
    const payer = (provider.wallet as anchor.Wallet).payer

    const [poolAddress, poolBump] = anchor.web3.PublicKey.findProgramAddressSync(
        [
            Buffer.from(LIQUIDITY_POOL_SEED_PREFIX)
        ],
        program.programId
    )
    const assets = assetsConfig.assets.map((o) => {
        return {
            name: o.name,
            quantity: o.quantity,
            decimals: o.decimals,
            address: new PublicKey(o.address),// 这个是mint 地址

        }
    })
    console.log(program.programId.toString());
    //poolBump
    console.log(`pool Bump: ${poolBump}`);
    console.log(`Pool Address: ${poolAddress.toString()}`);


    const maxAssetIndex = assetsConfig.assets.length - 1

    // 用作一个标志，仅初始化一次流动性池
    let programInitialized = false;

    /**
     * 检查流动性池是否存在并设置标志
     */
    before('          Check if Pool exists', async () => {
        let poolAccountInfo = await provider.connection.getAccountInfo(
            poolAddress
        )
        if (poolAccountInfo != undefined && poolAccountInfo.lamports != 0) {
            console.log('   Pool already initialized!')
            console.log(`     Address: ${poolAddress.toBase58()}`)
            programInitialized = true
        }
    })

    /**
     * 如果流动性池尚不存在，则对其进行初始化
     */

    /**
     * 创建流动性池
     */
    it('          Create Pool', async () => {
        console.log('programInitialized=', programInitialized);
        if (!programInitialized) {
            const txCreatePool = await createPool(program, payer, poolAddress)
            console.log(`     Transaction: ${txCreatePool}`)
        }
    })

    /**
     * 如果我们刚刚创建了流动性池，为其注入资金
    */
    for (const asset of assets) {
        it(`          Fund Pool with ${asset.name}`, async () => {

            let txMintTokens = await mintExistingTokens(
                provider.connection,
                payer,
                asset.address,
                asset.quantity,
                asset.decimals
            );
            console.log(`     Transaction: ${txMintTokens}`)

            const txFundPool = await funPool(
                program,
                payer,
                poolAddress,
                asset.address,
                asset.quantity,
                asset.decimals
            )
            console.log(`     Transaction: ${txFundPool}`)

        })
        // break;
    }

    /**
     * 计算流动性池的持有量（每个代币账户中持有的资产）
     * @param log - 是否输出日志的布尔标志
     * @returns 返回流动性池的常数乘积K值（bigint类型）
     */
    async function getPoolData(log: boolean): Promise<bigint> {
        /**
         * 获取流动性池的核心数据结构
         * 包含池的基本配置和状态信息
         */
        const pool = await fetchPool(program, poolAddress);
        // console.log("pool", JSON.stringify(pool, null, 2))
        /**
         * 获取流动性池关联的所有代币账户数据
         * 包含每个代币账户的地址和余额信息
         */
        const poolTokenAccounts = await fetchPoolTokenAccounts(provider.connection, poolAddress, pool);

        /**
         * 计算常数乘积模型的K值（储备金乘积的平方根）
         * 用于衡量流动性池的资产配置平衡度
         */
        const k = calculateConstantProductK(poolTokenAccounts);

        /**
         * 条件性日志记录模块
         * 当log参数为true时，输出池状态到控制台
         */
        if (log) {
            await logPool(provider.connection, poolAddress, poolTokenAccounts, assets, k);
        }

        return k;
    }
    /**
     * 打印流动性池的持有量（每个代币账户中持有的资产）
     */
    it('          Get Liquidity Pool Data', async () => {
        const k = await getPoolData(true);
        logK(k);
    });

    /**
     * 尝试使用我们的交换程序进行交换
     * @param receive - 接收的代币信息
     * @param receive.name - 代币名称
     * @param receive.quantity - 代币数量
     * @param receive.decimals - 代币精度
     * @param receive.address - 代币地址
     * @param pay - 支付的代币信息
     * @param pay.name - 代币名称
     * @param pay.quantity - 代币数量
     * @param pay.decimals - 代币精度
     * @param pay.address - 代币地址
     * @param payAmount - 支付金额
     */
    async function trySwap(
        receive: {
            name: string
            quantity: number
            decimals: number
            address: PublicKey
        },
        pay: {
            name: string
            quantity: number
            decimals: number
            address: PublicKey
        },
        payAmount: number
    ) {

        // 检测 mint程序是否存在
        const tx = await mintExistingTokens(
            provider.connection,
            payer,
            pay.address,
            payAmount,
            pay.decimals,
        );
        console.log(`  trySwap   Transaction: ${tx}`);

        await sleepSeconds(1);

        // 获取交换前的池数据
        const initialK = await getPoolData(false);

        // 记录交换前的日志信息
        await logPreSwap(
            provider.connection,
            payer.publicKey,
            poolAddress,
            receive,
            pay,
            payAmount
        );

        // 执行交换操作
        await swap(
            program,
            payer,
            poolAddress,
            receive.address,
            pay.address,
            payAmount,
            pay.decimals
        );

        await sleepSeconds(2);

        // 记录交换后的日志信息
        await logPostSwap(
            provider.connection,
            payer.publicKey,
            poolAddress,
            receive,
            pay
        );

        // 计算并记录K值变化
        const resultingK = await getPoolData(false);
        logChangeInK(calculateChangeInK(initialK, resultingK))

    }

    // 运行10 个随机 交易程序
    for (let x = 0; x < 10; x++) {
        it(' Try Swap ', async () => {
            const receiveAssetIndex = getRandomInt(maxAssetIndex)
            console.log(`  trySwap   Swapping receiveAssetIndex=  ${receiveAssetIndex}`);
            let payAssetIndex = getRandomInt(maxAssetIndex)
            console.log(`  trySwap   Swapping payAssetIndex=  ${payAssetIndex}`);
            while (payAssetIndex == receiveAssetIndex) {
                payAssetIndex = getRandomInt(maxAssetIndex)
            }
            // pay amount can't be zero
            let payAmount = getRandomInt(assets[payAssetIndex]['quantity'])

            // return;
            while (payAmount === 0) {
                payAmount = getRandomInt(assets[payAssetIndex]['quantity'])
            }
            await trySwap(
                assets[receiveAssetIndex],
                assets[payAssetIndex],
                payAmount
            );
        })
        // break;
    }
    console.log('Done')

});
