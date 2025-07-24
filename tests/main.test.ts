import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SwapProgram } from "../target/types/swap_program";
import assetsConfig from "./utils/assets.json";
import { PublicKey } from "@solana/web3.js";

import { createPool, funPool, swap } from "./instructions";
import { fetchPool, fetchPoolTokenAccounts, calculateConstantProductK } from "./utils/swap";

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
    it("Is initialized!", async () => {
        // Add your test here.
        const tx = await program.methods.initialize().rpc();
        console.log("Your transaction signature", tx);
    });
    /**
     * 创建流动性池
     */
    it('          Create Pool', async () => {
        if (!programInitialized) {
            await createPool(program, payer, poolAddress)
        }
    })
    /**
     * 如果我们刚刚创建了流动性池，为其注入资金
     */
    for (const asset of assets) {
        it(`          Fund Pool with ${asset.name}`, async () => {
            if (!programInitialized) {
                await funPool(
                    program,
                    payer,
                    poolAddress,
                    asset.address,
                    asset.quantity,
                    asset.decimals
                )
            }
        })
    }
    /**
     * 计算流动性池的持有量（每个代币账户中持有的资产）
     */
    async function getPoolData(log: boolean): Promise<bigint> {
        const pool = await fetchPool(program, poolAddress);
        const poolTokenAccounts = await fetchPoolTokenAccounts(provider.connection, poolAddress, pool);

        const k = calculateConstantProductK(poolTokenAccounts);
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
        await mintExistingTokens(
            provider.connection.rpcEndpoint,
            payer,
            poolAddress,
            receive,
            pay,
            payAmount
        );
    }
});
