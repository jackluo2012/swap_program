import {
    Account as TokenAccount,
    getAssociatedTokenAddressSync,
    getMint,
    getAccount as getTokenAccount,
} from '@solana/spl-token'
import { Connection, PublicKey } from '@solana/web3.js'
import { fromBigIntQuantity } from './tokens'
import { calculateBalances } from './swap'

/**
 * Log a line break
 */
function lineBreak() {
    console.log('----------------------------------------------------')
}

/**
 *
 * Log information about a newly created asset mint
 *
 * @param name Asset name
 * @param decimals Asset mint decimals
 * @param quantity Quantity of asset minted
 * @param mint Asset mint address
 * @param signature Transaction signature of the minting
 */
export function logNewMint(
    name: string,
    decimals: number,
    quantity: number,
    mint: PublicKey,
    signature: string
) {
    lineBreak()
    console.log(`   Mint: ${name}`)
    console.log(`       Address:    ${mint.toBase58()}`)
    console.log(`       Decimals:   ${decimals}`)
    console.log(`       Quantity:   ${quantity}`)
    console.log(`       Transaction Signature: ${signature}`)
    lineBreak()
}

// Logs information about a swap - can be pre- or post-swap
//中文 描述
/**
 * 记录交易前的状态，包括用户和资金池在支付和接收资产上的余额。
 * 
 * @param connection - 用于获取账户数据的Solana连接对象。
 * @param owner - 发起交易的用户的公钥。
 * @param pool - 参与此交易的流动性池的公钥。
 * @param receive - 包含接收资产详情的对象：
 *   - name: 资产名称。
 *   - quantity: 资产数量（在此函数中未直接使用）。
 *   - decimals: 资产的小数位数。
 *   - address: 资产的铸币或代币账户的公钥。
 * @param pay - 包含支付资产详情的对象：
 *   - name: 资产名称。
 *   - quantity: 资产数量（在此函数中未直接使用）。
 *   - decimals: 资产的小数位数。
 *   - address: 资产的铸币或代币账户的公钥。
 * @param amount - 用户打算用于交换的"支付"资产的数量。
 */
export async function logPreSwap(
    connection: Connection,
    owner: PublicKey,
    pool: PublicKey,
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
    amount: number
) {
    // 获取用户和资金池在两种资产上的当前余额
    const [
        receiveUserBalance,
        receivePoolBalance,
        payUserBalance,
        payPoolBalance,
    ] = await calculateBalances(
        connection,
        owner,
        pool,
        receive.address,
        receive.decimals,
        pay.address,
        pay.decimals
    )

    // 打印标题和基本交易信息
    lineBreak()
    console.log('   交易前状态:')
    console.log()
    console.log(
        `       支付: ${pay.name.padEnd(
            18,
            ' '
        )}  接收: ${receive.name.padEnd(18, ' ')}`
    )
    console.log(`       拟支付数量: ${amount}`)
    console.log()

    // 打印交易前用户和资金池余额的格式化表格
    console.log('   |====================|==============|==============|')
    console.log('   | 资产:              | 用户:        | 资金池:      |')
    console.log('   |====================|==============|==============|')
    console.log(
        `   | ${pay.name.padEnd(18, ' ')} | ${payUserBalance.padStart(
            12,
            ' '
        )} | ${payPoolBalance.padStart(12, ' ')} |`
    )
    console.log(
        `   | ${receive.name.padEnd(18, ' ')} | ${receiveUserBalance.padStart(
            12,
            ' '
        )} | ${receivePoolBalance.padStart(12, ' ')} |`
    )
    console.log('   |====================|==============|==============|')
    console.log()
}

/**
 * 记录交换操作后的资产余额信息
 * 
 * @param connection - Solana网络连接对象
 * @param owner - 资产所有者的公钥
 * @param pool - 交易池的公钥
 * @param receive - 接收的资产信息，包括名称、数量、精度和地址
 * @param pay - 支付的资产信息，包括名称、数量、精度和地址
 */
export async function logPostSwap(
    connection: Connection,
    owner: PublicKey,
    pool: PublicKey,
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
    }
) {
    // 获取交换后用户和交易池的资产余额
    const [
        receiveUserBalance,
        receivePoolBalance,
        payUserBalance,
        payPoolBalance,
    ] = await calculateBalances(
        connection,
        owner,
        pool,
        receive.address,
        receive.decimals,
        pay.address,
        pay.decimals
    )

    // 打印交换后的余额信息表格
    console.log('   交换后:')
    console.log()
    console.log('   |====================|==============|==============|')
    console.log('   | 资产 :             | 用户:        | 资金:        |')
    console.log('   |====================|==============|==============|')
    console.log(
        `   | ${pay.name.padEnd(18, ' ')} | ${payUserBalance.padStart(
            12,
            ' '
        )} | ${payPoolBalance.padStart(12, ' ')} |`
    )
    console.log(
        `   | ${receive.name.padEnd(18, ' ')} | ${receiveUserBalance.padStart(
            12,
            ' '
        )} | ${receivePoolBalance.padStart(12, ' ')} |`
    )
    console.log('   |====================|==============|==============|')
    console.log()
    lineBreak()
}

/**
 *
 * Logs the Liquidity Pool's holdings (assets held in each token account)
 * 记录流动性池的持有量（每个代币账户中持有的资产）
 * @param connection Connection to Solana RPC
 * @param poolAddress Address of the Liquidity Pool
 * @param tokenAccounts All token accounts owned by the Liquidity Pool
 * @param assets The assets from the configuration file
 * @param k The constant-product `K` (Constant-Product Algorithm)
 */
/**
 * 打印流动性池的详细信息到控制台
 * @param connection - Solana网络连接对象
 * @param poolAddress - 流动性池的公钥地址
 * @param tokenAccounts - 代币账户数组，包含池中各种代币的余额信息
 * @param assets - 资产信息数组，包含每个资产的名称、数量、小数位数和地址
 * @param k - 恒定乘积参数k值
 */
/**
 * 打印流动性池的详细信息到控制台
 * @param connection - Solana网络连接对象，用于获取链上数据
 * @param poolAddress - 流动性池的公钥地址
 * @param tokenAccounts - 代币账户数组，包含池中各种代币的余额信息
 * @param assets - 资产信息数组，包含每个资产的名称、数量、小数位数和地址
 * @param k - 恒定乘积参数k值（x * y = k）
 */
export async function logPool(
    connection: Connection,
    poolAddress: PublicKey,
    tokenAccounts: TokenAccount[],
    assets: {
        name: string
        quantity: number
        decimals: number
        address: PublicKey
    }[],
    k: bigint
) {
    /**
     * 根据代币mint地址获取对应的持有数量
     * @param mint - 代币的mint地址
     * @param tokenAccounts - 代币账户数组
     * @returns 对应代币的持有数量
     */
    function getHoldings(
        mint: PublicKey,
        tokenAccounts: TokenAccount[]
    ): bigint {
        // 在代币账户数组中查找与指定mint地址匹配的账户
        const holding = tokenAccounts.find((account) =>
            account.mint.equals(mint)
        )
        // 返回找到的账户中的代币数量
        return holding.amount
    }

    // 计算资产名称的最大长度，用于后续格式化输出时对齐
    const padding = assets.reduce((max, a) => Math.max(max, a.name.length), 0)

    // 输出池的基本信息和各资产持有情况
    lineBreak() // 打印分隔线
    console.log('   Liquidity Pool:') // 打印标题
    console.log(`       Address:    ${poolAddress.toBase58()}`) // 打印池地址
    console.log('       Holdings:') // 打印持有资产标题

    // 遍历所有资产，打印每个资产的持有情况
    for (const a of assets) {
        const holding = getHoldings(a.address, tokenAccounts) // 获取该资产的持有数量
        const mint = await getMint(connection, a.address) // 获取代币的mint信息
        const normalizedHolding = fromBigIntQuantity(holding, mint.decimals) // 将持有数量转换为标准单位
        // 格式化输出资产信息：名称、数量和地址
        console.log(
            `                   ${a.name.padEnd(
                padding,
                ' '
            )} : ${normalizedHolding.padStart(
                12,
                ' '
            )} : ${a.address.toBase58()}`
        )
    }

    // 输出恒定乘积参数k值并添加行分隔符
    logK(k) // 打印k值
    lineBreak() // 打印分隔线
}

/**
 *
 * Logs `K`
 *
 * @param k The constant-product `K` (Constant-Product Algorithm)
 */
export function logK(k: bigint) {
    console.log(`   ** Constant-Product (K): ${k.toString()}`)
}

/**
 *
 * Logs `ΔK` ("delta K", or "change in K")
 *
 * @param changeInK The change in the constant-product `K` (Constant-Product Algorithm)
 */
export function logChangeInK(changeInK: string) {
    console.log(`   ** Δ Change in Constant-Product (K): ${changeInK}`)
}
