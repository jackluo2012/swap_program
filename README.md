# swap-program

### 使用 pnpm 安装依赖，能解决版本冲突。

### update file o aw

[创建 solana 代码的文档](https://developers.metaplex.com/guides/javascript/how-to-create-a-solana-token)

## 先上传需要的资源文件

```bash
anchor run upload-json
```

```output
[运行脚本设置]: 上传资源
✅ 图片上传成功: https://gateway.irys.xyz/9fawa7qNQkYswnTZiovEAJ5ThXBwxrXS5hncFP27AbFb
✅ Metadata 上传成功: https://gateway.irys.xyz/56WvW4pxYkssPcWZsR75BvFFxpcUG9yHctQiAH6iAzaP
imageUri: https://gateway.irys.xyz/9fawa7qNQkYswnTZiovEAJ5ThXBwxrXS5hncFP27AbFb
metadataUri: https://gateway.irys.xyz/56WvW4pxYkssPcWZsR75BvFFxpcUG9yHctQiAH6iAzaP
    ✔ 上传资源: Cannon (58592ms)
✅ 图片上传成功: https://gateway.irys.xyz/9BeBgTrWhDp3Cu5CmCFDFW36renow2EK8UiUfFsNcom6
✅ Metadata 上传成功: https://gateway.irys.xyz/2nMNMW1iTQZL42rQHg2kkbK87B69XQfZQqWTfN4ZUCGg
imageUri: https://gateway.irys.xyz/9BeBgTrWhDp3Cu5CmCFDFW36renow2EK8UiUfFsNcom6
metadataUri: https://gateway.irys.xyz/2nMNMW1iTQZL42rQHg2kkbK87B69XQfZQqWTfN4ZUCGg
    ✔ 上传资源: Cannon Ball (25749ms)
✅ 图片上传成功: https://gateway.irys.xyz/FUHFXJWReQYHmnwZwpuYtxREXDdjQ69JAgXKWwcmUg6u
✅ Metadata 上传成功: https://gateway.irys.xyz/9pszUXkqTe4D96cymcUpXmQJHCrhB11i12kTRMYYbPKg
imageUri: https://gateway.irys.xyz/FUHFXJWReQYHmnwZwpuYtxREXDdjQ69JAgXKWwcmUg6u
metadataUri: https://gateway.irys.xyz/9pszUXkqTe4D96cymcUpXmQJHCrhB11i12kTRMYYbPKg
    ✔ 上传资源: Compass (25119ms)
✅ 图片上传成功: https://gateway.irys.xyz/2zM7TPjh4ydgZEZqTZ8dFPmvpcTGNq5WUJvxDdHCMfod
✅ Metadata 上传成功: https://gateway.irys.xyz/88KRrCGJESSxMNFJjabEQypofHmxoSFFYrG8SXKgF9E3
imageUri: https://gateway.irys.xyz/2zM7TPjh4ydgZEZqTZ8dFPmvpcTGNq5WUJvxDdHCMfod
metadataUri: https://gateway.irys.xyz/88KRrCGJESSxMNFJjabEQypofHmxoSFFYrG8SXKgF9E3
    ✔ 上传资源: Fishing Net (25072ms)
✅ 图片上传成功: https://gateway.irys.xyz/2Uuk5D7k5a514p8yqbh31o2Pp5ksUScJNxz6a9jCqorW
✅ Metadata 上传成功: https://gateway.irys.xyz/7RZ5ctpnqBSRHzRbaFYyxwJcbJgX1TmGgcBuPbWUvzb4
imageUri: https://gateway.irys.xyz/2Uuk5D7k5a514p8yqbh31o2Pp5ksUScJNxz6a9jCqorW
metadataUri: https://gateway.irys.xyz/7RZ5ctpnqBSRHzRbaFYyxwJcbJgX1TmGgcBuPbWUvzb4
    ✔ 上传资源: Gold (25254ms)
✅ 图片上传成功: https://gateway.irys.xyz/BBmFEzKrjuSAMPYtSr1Mt5MdmMx2vQLJnetM8N3rcUmt
✅ Metadata 上传成功: https://gateway.irys.xyz/8v2jnYmYQZkzwXWrPWrnocCF2zQkAzMmEDfovYLmh7yo
imageUri: https://gateway.irys.xyz/BBmFEzKrjuSAMPYtSr1Mt5MdmMx2vQLJnetM8N3rcUmt
metadataUri: https://gateway.irys.xyz/8v2jnYmYQZkzwXWrPWrnocCF2zQkAzMmEDfovYLmh7yo
    ✔ 上传资源: Grappling Hook (25429ms)
✅ 图片上传成功: https://gateway.irys.xyz/4q863B1GHm8xHbkJyYMi1PAMXDYQvgakYVzsFyEMmoXL
✅ Metadata 上传成功: https://gateway.irys.xyz/FRtCyUFUcM9F4bUKpd9825UAgtF158wsgXRpfump2yYG
imageUri: https://gateway.irys.xyz/4q863B1GHm8xHbkJyYMi1PAMXDYQvgakYVzsFyEMmoXL
metadataUri: https://gateway.irys.xyz/FRtCyUFUcM9F4bUKpd9825UAgtF158wsgXRpfump2yYG
    ✔ 上传资源: Gunpowder (25893ms)
✅ 图片上传成功: https://gateway.irys.xyz/CDg8vqiFjBF1RcP3PUxy2BVZ4ioMp5FLg95zP7S3ssqL
✅ Metadata 上传成功: https://gateway.irys.xyz/AX9JWg9u7QXkp6886U8wRZfJnXp7sNXTuQL38zsDLMEt
imageUri: https://gateway.irys.xyz/CDg8vqiFjBF1RcP3PUxy2BVZ4ioMp5FLg95zP7S3ssqL
metadataUri: https://gateway.irys.xyz/AX9JWg9u7QXkp6886U8wRZfJnXp7sNXTuQL38zsDLMEt
    ✔ 上传资源: Musket (26878ms)
✅ 图片上传成功: https://gateway.irys.xyz/FfqsPTtQyoQihdKu6mQkFdRVWdV8NuSiFHkLSvg2KD5P
✅ Metadata 上传成功: https://gateway.irys.xyz/3yCKxYDSpCCY1MYF75tZHpFdZf4AMU71NZE7ZGoqdeig
imageUri: https://gateway.irys.xyz/FfqsPTtQyoQihdKu6mQkFdRVWdV8NuSiFHkLSvg2KD5P
metadataUri: https://gateway.irys.xyz/3yCKxYDSpCCY1MYF75tZHpFdZf4AMU71NZE7ZGoqdeig
    ✔ 上传资源: Rum (27071ms)
✅ 图片上传成功: https://gateway.irys.xyz/C34jLkhrzxvyZX8xLX7cmt5z2oDngZthxqHKpbkLPrfY
✅ Metadata 上传成功: https://gateway.irys.xyz/q9qdEzR3bN51UorVV4jx53si89xSjFm9m1SyToB3pDg
imageUri: https://gateway.irys.xyz/C34jLkhrzxvyZX8xLX7cmt5z2oDngZthxqHKpbkLPrfY
metadataUri: https://gateway.irys.xyz/q9qdEzR3bN51UorVV4jx53si89xSjFm9m1SyToB3pDg
    ✔ 上传资源: Telescope (26082ms)
✅ 图片上传成功: https://gateway.irys.xyz/BR9AFXz3Ek3QQo48bDi9uRPiegYg4veHP3Fo371ewp8n
✅ Metadata 上传成功: https://gateway.irys.xyz/Db8bubEJN9bxPHQyUp6bdTGLBr8AaK2mh7zAGjemx6Np
imageUri: https://gateway.irys.xyz/BR9AFXz3Ek3QQo48bDi9uRPiegYg4veHP3Fo371ewp8n
metadataUri: https://gateway.irys.xyz/Db8bubEJN9bxPHQyUp6bdTGLBr8AaK2mh7zAGjemx6Np
    ✔ 上传资源: Treasure Map (25284ms)


  11 passing (5m)

Done in 343.60s.
jackluo@jackluo-window:/mnt/d/works/learn/rust/solana/swap-program$
```

### 创建 core tokens 文档

[创建 tokens 文档](https://developers.metaplex.com/token-metadata/token-standard)

### 这个文档 不是太靠谱，各种 坑，最终发现有个好的 createminttoken 函数。

```bash
anchor run create-tokens
```

### 部署写的 swamp 程序

```bash
anchor build
anchor deploy
```

### 运行交换测试程序

```bash
anchor run test
```

```output
jackluo@jackluo-window:/mnt/d/works/learn/rust/solana/swap-program$ anchor run test
yarn run v1.22.22
$ /mnt/d/works/learn/rust/solana/swap-program/node_modules/.bin/ts-mocha -p ./tsconfig.json -t 1000000 tests/main.test.ts
bigint: Failed to load bindings, pure JS will be used (try npm run rebuild?)
4yCxmVu65qfVi4wreCW58yudn8Mz41LJ8yTMUXeoPUTB
pool Bump: 255
Pool Address: Crw64N3zcdg6gQhUd4JpTrZioqa983WPLMLZbcefXgw1


  [Running Unit Tests]: Swap Program
   Pool already initialized!
     Address: Crw64N3zcdg6gQhUd4JpTrZioqa983WPLMLZbcefXgw1
----------------------------------------------------
   Liquidity Pool:
       Address:    Crw64N3zcdg6gQhUd4JpTrZioqa983WPLMLZbcefXgw1
       Holdings:
                   Cannon         :  1005.815811 : 6PdJLDtYkzH4UavoVbGu9c3Jgxq2nto5pxQjd49HGrrj
                   Cannon Ball    :  3181.000000 : CTboVDxK8nxaJpYqTNmjyNi1dcHpqBpJDAvQ5JqU6UdD
                   Compass        :   515.863160 : 8faCSx8sv4FxgvWpC3CTap27HPTK3136414XBVW5pBg3
                   Fishing Net    :  2944.000000 : 2vAHBEYTGQSYHe3hDc8hT8Sw77DKdrnKnCtaZpYNxYee
                   Gold           :   228.287020 : GhiBWhX6ZyGhTTciRfXsGGFPC9FzaSMus12wAwW5fSUz
                   Grappling Hook :  1093.400000 : Dd4HZCekyP3efGo4aWLYdEiVnw71hSuuKegwNvWkKgWB
                   Gunpowder      :   467.000000 : 2tSYa1pPJZNVPz7392QfaijhPFcHpG8HaSuKGavoEtDw
                   Musket         :  1100.942300 : EzeUTfA35BZoC7YmWqTcYXcrLTNEMktGzFa9pCdCwohi
                   Rum            :  1949.000000 : GQMSGHtvgb48oqbXdvNXiHMFbQ1sYBip2BiRupda6pGZ
                   Telescope      :   952.065000 : GzHxnrg5PYpyZ7JKgb24iWicLwiozBvUk2dmaXuF2sE1
                   Treasure Map   :   158.000000 : J9LtRvr28KBbT1ptMjL5LYb7HzHvD6D2EDUjB6e2jHDy
   ** Constant-Product (K): 182823365996060044652800068286525057129392297504832455966720000000000000000000000000000000
----------------------------------------------------
   ** Constant-Product (K): 182823365996060044652800068286525057129392297504832455966720000000000000000000000000000000
    ✔           Get Liquidity Pool Data (3860ms)
  trySwap   Swapping receiveAssetIndex=  5
  trySwap   Swapping payAssetIndex=  0
  trySwap   Swapping assets[payAssetIndex]=   {
  "name": "Cannon",
  "quantity": 410,
  "decimals": 9,
  "address": "6PdJLDtYkzH4UavoVbGu9c3Jgxq2nto5pxQjd49HGrrj"
}

----------------------------------------------------
   PRE-SWAP:

       PAY: Cannon              RECEIVE: Grappling Hook
       OFFERING TO PAY: 102

   |====================|==============|==============|
   | Asset:             | User:        | Pool:        |
   |====================|==============|==============|
   | Cannon             |  1556.184189 |  1005.815811 |
   | Grappling Hook     |  1468.900000 |  1093.400000 |
   |====================|==============|==============|

   POST-SWAP:

   |====================|==============|==============|
   | Asset:             | User:        | Pool:        |
   |====================|==============|==============|
   | Cannon             |  1454.184189 |  1107.815811 |
   | Grappling Hook     |  1569.500000 |   992.800000 |
   |====================|==============|==============|

----------------------------------------------------
   ** Δ Change in Constant-Product (K): 0.0073%
    ✔  Try Swap  (8878ms)
  trySwap   Swapping receiveAssetIndex=  1
  trySwap   Swapping payAssetIndex=  0
  trySwap   Swapping assets[payAssetIndex]=   {
  "name": "Cannon",
  "quantity": 410,
  "decimals": 9,
  "address": "6PdJLDtYkzH4UavoVbGu9c3Jgxq2nto5pxQjd49HGrrj"
}

----------------------------------------------------
   PRE-SWAP:

       PAY: Cannon              RECEIVE: Cannon Ball
       OFFERING TO PAY: 88

   |====================|==============|==============|
   | Asset:             | User:        | Pool:        |
   |====================|==============|==============|
   | Cannon             |  1542.184189 |  1107.815811 |
   | Cannon Ball        |   947.000095 |  3181.000000 |
   |====================|==============|==============|

   POST-SWAP:

   |====================|==============|==============|
   | Asset:             | User:        | Pool:        |
   |====================|==============|==============|
   | Cannon             |  1454.184189 |  1195.815811 |
   | Cannon Ball        |  1181.089669 |  2946.910426 |
   |====================|==============|==============|

----------------------------------------------------
   ** Δ Change in Constant-Product (K): -0.0000%
    ✔  Try Swap  (8961ms)
  trySwap   Swapping receiveAssetIndex=  2
  trySwap   Swapping payAssetIndex=  3
  trySwap   Swapping assets[payAssetIndex]=   {
  "name": "Fishing Net",
  "quantity": 861,
  "decimals": 2,
  "address": "2vAHBEYTGQSYHe3hDc8hT8Sw77DKdrnKnCtaZpYNxYee"
}

----------------------------------------------------
   PRE-SWAP:

       PAY: Fishing Net         RECEIVE: Compass
       OFFERING TO PAY: 822

   |====================|==============|==============|
   | Asset:             | User:        | Pool:        |
   |====================|==============|==============|
   | Fishing Net        |  1691.610000 |  2944.000000 |
   | Compass            |   562.137176 |   515.863160 |
   |====================|==============|==============|

   POST-SWAP:

   |====================|==============|==============|
   | Asset:             | User:        | Pool:        |
   |====================|==============|==============|
   | Fishing Net        |   869.610000 |  3766.000000 |
   | Compass            |   674.733968 |   403.266368 |
   |====================|==============|==============|

----------------------------------------------------
   ** Δ Change in Constant-Product (K): -0.0000%
    ✔  Try Swap  (8809ms)
  trySwap   Swapping receiveAssetIndex=  0
  trySwap   Swapping payAssetIndex=  4
  trySwap   Swapping assets[payAssetIndex]=   {
  "name": "Gold",
  "quantity": 134,
  "decimals": 5,
  "address": "GhiBWhX6ZyGhTTciRfXsGGFPC9FzaSMus12wAwW5fSUz"
}

----------------------------------------------------
   PRE-SWAP:

       PAY: Gold                RECEIVE: Cannon
       OFFERING TO PAY: 34

   |====================|==============|==============|
   | Asset:             | User:        | Pool:        |
   |====================|==============|==============|
   | Gold               |   263.714320 |   228.287020 |
   | Cannon             |  1454.184189 |  1195.815811 |
   |====================|==============|==============|

   POST-SWAP:

   |====================|==============|==============|
   | Asset:             | User:        | Pool:        |
   |====================|==============|==============|
   | Gold               |   229.714320 |   262.287020 |
   | Cannon             |  1609.196588 |  1040.803412 |
   |====================|==============|==============|

----------------------------------------------------
   ** Δ Change in Constant-Product (K): -0.0000%
    ✔  Try Swap  (8775ms)
  trySwap   Swapping receiveAssetIndex=  1
  trySwap   Swapping payAssetIndex=  1
  trySwap   Swapping assets[payAssetIndex]=   {
  "name": "Cannon",
  "quantity": 410,
  "decimals": 9,
  "address": "6PdJLDtYkzH4UavoVbGu9c3Jgxq2nto5pxQjd49HGrrj"
}
  trySwap   Swapping payAmount=  350
  trySwap   Swapping receive=   {
  "name": "Cannon Ball",
  "quantity": 947,
  "decimals": 7,
  "address": "CTboVDxK8nxaJpYqTNmjyNi1dcHpqBpJDAvQ5JqU6UdD"
}

----------------------------------------------------
   PRE-SWAP:

       PAY: Cannon              RECEIVE: Cannon Ball
       OFFERING TO PAY: 350

   |====================|==============|==============|
   | Asset:             | User:        | Pool:        |
   |====================|==============|==============|
   | Cannon             |  1959.196588 |  1040.803412 |
   | Cannon Ball        |  1181.089669 |  2946.910426 |
   |====================|==============|==============|

   POST-SWAP:

   |====================|==============|==============|
   | Asset:             | User:        | Pool:        |
   |====================|==============|==============|
   | Cannon             |  1609.196588 |  1390.803412 |
   | Cannon Ball        |  1922.688799 |  2205.311296 |
   |====================|==============|==============|

----------------------------------------------------
   ** Δ Change in Constant-Product (K): 0.0000%
    ✔  Try Swap  (9000ms)
  trySwap   Swapping receiveAssetIndex=  6
  trySwap   Swapping payAssetIndex=  9
  trySwap   Swapping assets[payAssetIndex]=   {
  "name": "Telescope",
  "quantity": 611,
  "decimals": 3,
  "address": "GzHxnrg5PYpyZ7JKgb24iWicLwiozBvUk2dmaXuF2sE1"
}

----------------------------------------------------
   PRE-SWAP:

       PAY: Telescope           RECEIVE: Gunpowder
       OFFERING TO PAY: 34

   |====================|==============|==============|
   | Asset:             | User:        | Pool:        |
   |====================|==============|==============|
   | Telescope          |   915.546000 |   952.065000 |
   | Gunpowder          |   205.000002 |   467.000000 |
   |====================|==============|==============|

   POST-SWAP:

   |====================|==============|==============|
   | Asset:             | User:        | Pool:        |
   |====================|==============|==============|
   | Telescope          |   881.546000 |   986.065000 |
   | Gunpowder          |   221.102388 |   450.897614 |
   |====================|==============|==============|

----------------------------------------------------
   ** Δ Change in Constant-Product (K): 0.0000%
    ✔  Try Swap  (10014ms)
  trySwap   Swapping receiveAssetIndex=  8
  trySwap   Swapping payAssetIndex=  9
  trySwap   Swapping assets[payAssetIndex]=   {
  "name": "Telescope",
  "quantity": 611,
  "decimals": 3,
  "address": "GzHxnrg5PYpyZ7JKgb24iWicLwiozBvUk2dmaXuF2sE1"
}
----------------------------------------------------
   PRE-SWAP:

       PAY: Telescope           RECEIVE: Rum
       OFFERING TO PAY: 9

   |====================|==============|==============|
   | Asset:             | User:        | Pool:        |
   |====================|==============|==============|
   | Telescope          |   890.546000 |   986.065000 |
   | Rum                |   928.000000 |  1949.000000 |
   |====================|==============|==============|

   POST-SWAP:

   |====================|==============|==============|
   | Asset:             | User:        | Pool:        |
   |====================|==============|==============|
   | Telescope          |   881.546000 |   995.065000 |
   | Rum                |   945.627995 |  1931.372005 |
   |====================|==============|==============|

----------------------------------------------------
   ** Δ Change in Constant-Product (K): -0.0000%
    ✔  Try Swap  (8891ms)
  trySwap   Swapping receiveAssetIndex=  3
  trySwap   Swapping payAssetIndex=  2
  trySwap   Swapping assets[payAssetIndex]=   {
  "name": "Compass",
  "quantity": 336,
  "decimals": 6,
  "address": "8faCSx8sv4FxgvWpC3CTap27HPTK3136414XBVW5pBg3"
}

----------------------------------------------------
   PRE-SWAP:

       PAY: Compass             RECEIVE: Fishing Net
       OFFERING TO PAY: 229

   |====================|==============|==============|
   | Asset:             | User:        | Pool:        |
   |====================|==============|==============|
   | Compass            |   903.733968 |   403.266368 |
   | Fishing Net        |   869.610000 |  3766.000000 |
   |====================|==============|==============|

   POST-SWAP:

   |====================|==============|==============|
   | Asset:             | User:        | Pool:        |
   |====================|==============|==============|
   | Compass            |   674.733968 |   632.266368 |
   | Fishing Net        |  2233.610000 |  2402.000000 |
   |====================|==============|==============|

----------------------------------------------------
   ** Δ Change in Constant-Product (K): 0.0002%
    ✔  Try Swap  (8986ms)
  trySwap   Swapping receiveAssetIndex=  9
  trySwap   Swapping payAssetIndex=  0
  trySwap   Swapping assets[payAssetIndex]=   {
  "name": "Cannon",
  "quantity": 410,
  "decimals": 9,
  "address": "6PdJLDtYkzH4UavoVbGu9c3Jgxq2nto5pxQjd49HGrrj"
}

----------------------------------------------------
   PRE-SWAP:

       PAY: Cannon              RECEIVE: Telescope
       OFFERING TO PAY: 60

   |====================|==============|==============|
   | Asset:             | User:        | Pool:        |
   |====================|==============|==============|
   | Cannon             |  1669.196588 |  1390.803412 |
   | Telescope          |   881.546000 |   995.065000 |
   |====================|==============|==============|

   POST-SWAP:

   |====================|==============|==============|
   | Asset:             | User:        | Pool:        |
   |====================|==============|==============|
   | Cannon             |  1609.196588 |  1450.803412 |
   | Telescope          |   922.698000 |   953.913000 |
   |====================|==============|==============|

----------------------------------------------------
   ** Δ Change in Constant-Product (K): 0.0000%
    ✔  Try Swap  (8960ms)
  trySwap   Swapping receiveAssetIndex=  3
  trySwap   Swapping payAssetIndex=  9
  trySwap   Swapping assets[payAssetIndex]=   {
  "name": "Telescope",
  "quantity": 611,
  "decimals": 3,
  "address": "GzHxnrg5PYpyZ7JKgb24iWicLwiozBvUk2dmaXuF2sE1"
}
  trySwap   Swapping payAmount=  455
  trySwap   Swapping receive=   {
  "name": "Fishing Net",
  "quantity": 861,
  "decimals": 2,
  "address": "2vAHBEYTGQSYHe3hDc8hT8Sw77DKdrnKnCtaZpYNxYee"
}
----------------------------------------------------
   PRE-SWAP:

       PAY: Telescope           RECEIVE: Fishing Net
       OFFERING TO PAY: 455

   |====================|==============|==============|
   | Asset:             | User:        | Pool:        |
   |====================|==============|==============|
   | Telescope          |  1377.698000 |   953.913000 |
   | Fishing Net        |  2233.610000 |  2402.000000 |
   |====================|==============|==============|

   POST-SWAP:

   |====================|==============|==============|
   | Asset:             | User:        | Pool:        |
   |====================|==============|==============|
   | Telescope          |   922.698000 |  1408.913000 |
   | Fishing Net        |  3009.320000 |  1626.290000 |
   |====================|==============|==============|

----------------------------------------------------
   ** Δ Change in Constant-Product (K): 0.0001%
    ✔  Try Swap  (8946ms)


  11 passing (2m)

Done in 141.46s.
```

```output
 anchor run test
yarn run v1.22.22
$ /mnt/d/works/learn/rust/solana/swap-program/node_modules/.bin/ts-mocha -p ./tsconfig.json -t 1000000 tests/main.test.ts
bigint: Failed to load bindings, pure JS will be used (try npm run rebuild?)
4yCxmVu65qfVi4wreCW58yudn8Mz41LJ8yTMUXeoPUTB
pool Bump: 255
Pool Address: Crw64N3zcdg6gQhUd4JpTrZioqa983WPLMLZbcefXgw1
Done


  [Running Unit Tests]: Swap Program
   Pool already initialized!
     Address: Crw64N3zcdg6gQhUd4JpTrZioqa983WPLMLZbcefXgw1
programInitialized= true
    ✔           Create Pool
     Transaction: 5T1VpRBi1gAuCfjCBUrQca68rADbwGbDdu5sSemthTk3ugzmpUDtrbd3k2aezKpQnzNx5ZFWBoLcroCLq1fUZyHK
     Transaction: 2JbJpAK71JJfCdnzrp275wXdHrKZrnfjknYfZefpu8Y45HEDQWxsL2wAchjHxXTqHR5K37HBrWFL63LvNZfQHTvn
    ✔           Fund Pool with Cannon (2290ms)
     Transaction: 3LNiMcui4FxeFJq8Pv4SK9ZqCsySkZNqCgoVZjbrz1KzPoi2kyTa1JqsgvqfPvLLvrxBnfPv571pkfVPb6BA4qtx
     Transaction: wMLGm5zD4qYKJKjgyDtpfqbhW8WqzGg5azxNaMSChoCc8JuQqVQWKhpgxUxHmTvqXcbvJ2Q2ybtEKEKtMJHf9XG
    ✔           Fund Pool with Cannon Ball (2832ms)
     Transaction: 2LrNAVe1KQCCJxcJo6Wey8D3vRQRZntM3pTrWiT6EpgedAUfxd6uMxabKdbk6PmHK2J6DtiaYAw6nWwuN6RLKZHo
     Transaction: 4o3QEhT4MvFKzMcqhkVrwAtD55J2iRghe1tstdeiYFMNLi66fkt8TuoLifDJAsjUKRfMc2fZBESfqgR8BjzGEhZN
    ✔           Fund Pool with Compass (2425ms)
     Transaction: 2FZwys82zWLPMQdHUDyr9QJb3wJ91czqgRgVbP6xKuoEX1wXeBDUAfwQgH3a4An4UVijihHEh8ZFYYBLcckV7TRg
     Transaction: 3qm8T1CT6RXTkjPUKSLxx1d33DiXYWefeyTpQz4tYiT17senCYQrhkETeqbGwvyzv2vtJ38NLcdt5d6s5jnBgqDt
    ✔           Fund Pool with Fishing Net (2417ms)
     Transaction: wnmPnk4rcEyaC1BXqco7rn91DMtjVyTyfH8t6PBacMuwhv3Jo97KVatmRTVdjVZ9ekrRHk4b9urEJJx24dVDtZw
     Transaction: 5mDe5GJ2zfXxeEKtwSJecZnyZQUoXANXvoijRmQohXCTSJPRvXccMzdFFGrxb6gcnXKWQvTgqJpmtwp4YPVnmqmg
    ✔           Fund Pool with Gold (2497ms)
     Transaction: 2bWzxQm9cpFw6kGZJki99NUMDXbUa9apsd7Vo79bJmaaKGjvqmgQc5JmMTfRmL8iZb7qVUwAQwdC79HyfYTdsYW7
     Transaction: 4kjuz78s6N6NQrCcMHiMhiUGsvf1eLjhSbiCeuaWTbFFjDHrHx9qT4TNGpg2dj4GHsuvSepSZAyuTiNd5VLzjpZp
    ✔           Fund Pool with Grappling Hook (2745ms)
     Transaction: SrBB3cYHxycMcXDeqPz8KuU334dzrbGrY8yysExjhuLMeCwS9ibNSgsbSfEgzm6CoJ1k4x3C9DEYjrEzeJK4Dnk
     Transaction: 4zX5Z2xNHBh9kDURfRQKi3jWZraBjLwLf1HKoyDQ9HaaFgd1rfSnSFLW8EdfyaET12zcarByHoTV5TU5mLTCcbEj
    ✔           Fund Pool with Gunpowder (2491ms)
     Transaction: 32xPtkUVgEB8r1qZw6ENZJ3riPErUkFzF8c7Pg3Uynsz8At7L3XNx9fQWPdeuuH5EXCanqz2tx248HFnNpSRWsTx
     Transaction: fdrvMLojXvLsit2PVV23UXwVH5TKHt7TSFAocpZaTWqUCaQDebMNnvyvYQHMEvgCGY2X2S9BovTy4B7WV5sjUsv
    ✔           Fund Pool with Musket (2493ms)
     Transaction: 57X41yzn2j1QmidZT8iRnfTUEnrKbhEBfPGR6JMYzwfKMSVufRuRHR47nrqKfCLYpm4RgdaRLQ7KqtSsNUetR9aT
     Transaction: 32vK8tEz6YNQCCTXKwNSBqi4N7fKinicNLTvFeKLQzKv2Qawi9AToT5ZbrgUXV6vQbY4w1eeShQg5zMJYNunrmzy
    ✔           Fund Pool with Rum (2910ms)
     Transaction: W1LddVduBh2Re511YAnQYJgGP9B9nQy4oAGytXPnMBjivdgbzupxQj8KyLcs1ebpraE3xrJvXsY8GkXqc12UgxK
     Transaction: 5gdQn9kRoxBdnmQfuqQr9uNpm6e1gXsU3jz2Jd2s6UvcCoqCw16Qk1qhYUgnrGtGvHERQsCvm96iAprC21eofRYv
    ✔           Fund Pool with Telescope (2719ms)
     Transaction: 27W3AJKuRyhDrQTav45s4zbxg3mZ4r2fSuxQ5z99BcGnyck2MNMLBRRTknXKFEng9YqFCWg6XFmrBXPu81TsmE35
     Transaction: 372QJ1yJ5gzyCE5KPPV2TzT9NUP6cQ7HvLRWGdXc6qHPhH9FFEQPkK8ZQCkSDjmeyG78a7tKEVGohfaoNfyiZ9Fp
    ✔           Fund Pool with Treasure Map (2404ms)
----------------------------------------------------
   Liquidity Pool:
       Address:    Crw64N3zcdg6gQhUd4JpTrZioqa983WPLMLZbcefXgw1
       Holdings:
                   Cannon         :  1769.298292 : 6PdJLDtYkzH4UavoVbGu9c3Jgxq2nto5pxQjd49HGrrj
                   Cannon Ball    :  5184.513510 : CTboVDxK8nxaJpYqTNmjyNi1dcHpqBpJDAvQ5JqU6UdD
                   Compass        :   500.116038 : 8faCSx8sv4FxgvWpC3CTap27HPTK3136414XBVW5pBg3
                   Fishing Net    :  2839.720000 : 2vAHBEYTGQSYHe3hDc8hT8Sw77DKdrnKnCtaZpYNxYee
                   Gold           :   337.898690 : GhiBWhX6ZyGhTTciRfXsGGFPC9FzaSMus12wAwW5fSUz
                   Grappling Hook :  2641.500000 : Dd4HZCekyP3efGo4aWLYdEiVnw71hSuuKegwNvWkKgWB
                   Gunpowder      :   788.897614 : 2tSYa1pPJZNVPz7392QfaijhPFcHpG8HaSuKGavoEtDw
                   Musket         :  2001.669200 : EzeUTfA35BZoC7YmWqTcYXcrLTNEMktGzFa9pCdCwohi
                   Rum            :  2797.129536 : GQMSGHtvgb48oqbXdvNXiHMFbQ1sYBip2BiRupda6pGZ
                   Telescope      :  1640.945000 : GzHxnrg5PYpyZ7JKgb24iWicLwiozBvUk2dmaXuF2sE1
                   Treasure Map   :   237.000000 : J9LtRvr28KBbT1ptMjL5LYb7HzHvD6D2EDUjB6e2jHDy
   ** Constant-Product (K): 19973786037251191452998202456264678656076026619209237794115662401757906800401920819200000000
----------------------------------------------------
   ** Constant-Product (K): 19973786037251191452998202456264678656076026619209237794115662401757906800401920819200000000
    ✔           Get Liquidity Pool Data (4000ms)
  trySwap   Swapping receiveAssetIndex=  9
  trySwap   Swapping payAssetIndex=  2
  trySwap   Transaction: 2isorstxTvMoEw5usvZE3dS9hKBZsXpbP9Shy23yu9t2ZgnP2nPxjTcGJkXhefuUR8utBe25anfhWL7CrQKJcNEW
----------------------------------------------------
   交易前状态:

       支付: Compass             接收: Telescope
       拟支付数量: 66

   |====================|==============|==============|
   | 资产:              | 用户:        | 资金池:      |
   |====================|==============|==============|
   | Compass            |  1255.884298 |   500.116038 |
   | Telescope          |  2357.666000 |  1640.945000 |
   |====================|==============|==============|

   交换后:

   |====================|==============|==============|
   | 资产 :             | 用户:        | 资金:        |
   |====================|==============|==============|
   | Compass            |  1189.884298 |   566.116038 |
   | Telescope          |  2548.973000 |  1449.638000 |
   |====================|==============|==============|

----------------------------------------------------
   ** Δ Change in Constant-Product (K): 0.0000%
    ✔  Try Swap  (9109ms)
  trySwap   Swapping receiveAssetIndex=  1
  trySwap   Swapping payAssetIndex=  1
  trySwap   Transaction: 3NYYm7FJU6L1TMfh9RDzNmbqTzSjDGPDa3E7gNCURb6U9oPKJFHrMDrx7j6fCRkYtci4cXfFCk5AQ3txG6S9M5io
----------------------------------------------------
   交易前状态:

       支付: Gold                接收: Cannon Ball
       拟支付数量: 107

   |====================|==============|==============|
   | 资产:              | 用户:        | 资金池:      |
   |====================|==============|==============|
   | Gold               |   497.102650 |   337.898690 |
   | Cannon Ball        |  2097.486584 |  5184.513510 |
   |====================|==============|==============|

   交换后:

   |====================|==============|==============|
   | 资产 :             | 用户:        | 资金:        |
   |====================|==============|==============|
   | Gold               |   390.102650 |   444.898690 |
   | Cannon Ball        |  3344.383839 |  3937.616256 |
   |====================|==============|==============|

----------------------------------------------------
   ** Δ Change in Constant-Product (K): -0.0000%
    ✔  Try Swap  (9802ms)
  trySwap   Swapping receiveAssetIndex=  6
  trySwap   Swapping payAssetIndex=  1
  trySwap   Transaction: 4vU471D8fG3inJzcZD2h93p8bu5YKtY5s7JTGXF8Z6CEDQLhYwChSsorXgKGdbgrLgqRrcqM4GTjh4sUwsf3jzma
----------------------------------------------------
   交易前状态:

       支付: Cannon Ball         接收: Gunpowder
       拟支付数量: 532

   |====================|==============|==============|
   | 资产:              | 用户:        | 资金池:      |
   |====================|==============|==============|
   | Cannon Ball        |  3876.383839 |  3937.616256 |
   | Gunpowder          |   440.102388 |   788.897614 |
   |====================|==============|==============|

   交换后:

   |====================|==============|==============|
   | 资产 :             | 用户:        | 资金:        |
   |====================|==============|==============|
   | Cannon Ball        |  3344.383839 |  4469.616256 |
   | Gunpowder          |   534.001621 |   694.998381 |
   |====================|==============|==============|

----------------------------------------------------
   ** Δ Change in Constant-Product (K): -0.0000%
    ✔  Try Swap  (9093ms)
  trySwap   Swapping receiveAssetIndex=  8
  trySwap   Swapping payAssetIndex=  5
  trySwap   Transaction: 3KgPuz5AiHaodioXUkcxaDSPkS1FNTScJ8zMDCyMw4ocMkRydK6HWxzbpSRn1xDpqrJwxpP5XUmgpom3kcv2oFLT
----------------------------------------------------
   交易前状态:

       支付: Grappling Hook      接收: Rum
       拟支付数量: 14

   |====================|==============|==============|
   | 资产:              | 用户:        | 资金池:      |
   |====================|==============|==============|
   | Grappling Hook     |  3003.800000 |  2641.500000 |
   | Rum                |  3472.870464 |  2797.129536 |
   |====================|==============|==============|

   交换后:

   |====================|==============|==============|
   | 资产 :             | 用户:        | 资金:        |
   |====================|==============|==============|
   | Grappling Hook     |  2989.800000 |  2655.500000 |
   | Rum                |  3487.617147 |  2782.382853 |
   |====================|==============|==============|

----------------------------------------------------
   ** Δ Change in Constant-Product (K): -0.0000%
    ✔  Try Swap  (9193ms)
  trySwap   Swapping receiveAssetIndex=  9
  trySwap   Swapping payAssetIndex=  5
  trySwap   Transaction: mAMzN6efVvUnQ8DMU5t6MahbHH5stXamdmeYELRYeKzBmPVbGiJnv7R77HC2jDDLvDMYat12QKdWQDY6zP4MFFL
----------------------------------------------------
   交易前状态:

       支付: Grappling Hook      接收: Telescope
       拟支付数量: 9

   |====================|==============|==============|
   | 资产:              | 用户:        | 资金池:      |
   |====================|==============|==============|
   | Grappling Hook     |  2998.800000 |  2655.500000 |
   | Telescope          |  2548.973000 |  1449.638000 |
   |====================|==============|==============|

   交换后:

   |====================|==============|==============|
   | 资产 :             | 用户:        | 资金:        |
   |====================|==============|==============|
   | Grappling Hook     |  2989.800000 |  2664.500000 |
   | Telescope          |  2553.869000 |  1444.742000 |
   |====================|==============|==============|

----------------------------------------------------
   ** Δ Change in Constant-Product (K): 0.0000%
    ✔  Try Swap  (9383ms)
  trySwap   Swapping receiveAssetIndex=  6
  trySwap   Swapping payAssetIndex=  9
  trySwap   Transaction: 8a9Qs8V4YWRQwZZe6mBKmoR2nbG5vBgcTVz9rRSkavgTMU5fsy7SycZ8e9gd1gwBW3JdD6gLBwPN5JEen87s6P4
----------------------------------------------------
   交易前状态:

       支付: Telescope           接收: Gunpowder
       拟支付数量: 459

   |====================|==============|==============|
   | 资产:              | 用户:        | 资金池:      |
   |====================|==============|==============|
   | Telescope          |  3012.869000 |  1444.742000 |
   | Gunpowder          |   534.001621 |   694.998381 |
   |====================|==============|==============|

   交换后:

   |====================|==============|==============|
   | 资产 :             | 用户:        | 资金:        |
   |====================|==============|==============|
   | Telescope          |  2553.869000 |  1903.742000 |
   | Gunpowder          |   701.568592 |   527.431410 |
   |====================|==============|==============|

----------------------------------------------------
   ** Δ Change in Constant-Product (K): -0.0000%
    ✔  Try Swap  (9951ms)
  trySwap   Swapping receiveAssetIndex=  9
  trySwap   Swapping payAssetIndex=  5
  trySwap   Transaction: 3cHSeMg1Kot6tSPrR3aaDBzubpEghSXC7AZ87TUb2MUZywWmyEaKUYhvp96fmRP2jBfMfuJK3dj2YWM1VnLYYP5e
----------------------------------------------------
   交易前状态:

       支付: Grappling Hook      接收: Telescope
       拟支付数量: 219

   |====================|==============|==============|
   | 资产:              | 用户:        | 资金池:      |
   |====================|==============|==============|
   | Grappling Hook     |  3208.800000 |  2664.500000 |
   | Telescope          |  2553.869000 |  1903.742000 |
   |====================|==============|==============|

   交换后:

   |====================|==============|==============|
   | 资产 :             | 用户:        | 资金:        |
   |====================|==============|==============|
   | Grappling Hook     |  2989.800000 |  2883.500000 |
   | Telescope          |  2698.457000 |  1759.154000 |
   |====================|==============|==============|

----------------------------------------------------
   ** Δ Change in Constant-Product (K): 0.0000%
    ✔  Try Swap  (8903ms)
  trySwap   Swapping receiveAssetIndex=  4
  trySwap   Swapping payAssetIndex=  5
  trySwap   Transaction: 3kfdm16YZtmZ4BHAU6JfjegMSzMddMj5JKric9i6ysdnWSDvjnUkmGCWDYVFwuMv5FB8tvYt717HJUwPsdpvtss9
----------------------------------------------------
   交易前状态:

       支付: Grappling Hook      接收: Gold
       拟支付数量: 517

   |====================|==============|==============|
   | 资产:              | 用户:        | 资金池:      |
   |====================|==============|==============|
   | Grappling Hook     |  3506.800000 |  2883.500000 |
   | Gold               |   390.102650 |   444.898690 |
   |====================|==============|==============|

   交换后:

   |====================|==============|==============|
   | 资产 :             | 用户:        | 资金:        |
   |====================|==============|==============|
   | Grappling Hook     |  2989.800000 |  3400.500000 |
   | Gold               |   457.743470 |   377.257870 |
   |====================|==============|==============|

----------------------------------------------------
   ** Δ Change in Constant-Product (K): 0.0000%
    ✔  Try Swap  (8927ms)
  trySwap   Swapping receiveAssetIndex=  2
  trySwap   Swapping payAssetIndex=  3
  trySwap   Transaction: 3GRi4FC5687SvTUKqRZuPjcyGKrqN7thPiKesTjQ3REYYSLPnvFsXMTwxyvaKL3L6eMTrvQ8eE63b2FhUQAN4AmZ
----------------------------------------------------
   交易前状态:

       支付: Fishing Net         接收: Compass
       拟支付数量: 16

   |====================|==============|==============|
   | 资产:              | 用户:        | 资金池:      |
   |====================|==============|==============|
   | Fishing Net        |  4974.890000 |  2839.720000 |
   | Compass            |  1189.884298 |   566.116038 |
   |====================|==============|==============|

   交换后:

   |====================|==============|==============|
   | 资产 :             | 用户:        | 资金:        |
   |====================|==============|==============|
   | Fishing Net        |  4958.890000 |  2855.720000 |
   | Compass            |  1193.056127 |   562.944209 |
   |====================|==============|==============|

----------------------------------------------------
   ** Δ Change in Constant-Product (K): 0.0000%
    ✔  Try Swap  (9239ms)
  trySwap   Swapping receiveAssetIndex=  8
  trySwap   Swapping payAssetIndex=  4
  trySwap   Transaction: 3rpx7u7CUAYywqZUJp2RNMKtD8wANuZoQpHAUbTc2XyGN2xhomtpUnPaBrMyAsibfpZ1RmWrb5L5cWJgMvPtRaQw
----------------------------------------------------
   交易前状态:

       支付: Gold                接收: Rum
       拟支付数量: 11

   |====================|==============|==============|
   | 资产:              | 用户:        | 资金池:      |
   |====================|==============|==============|
   | Gold               |   468.743470 |   377.257870 |
   | Rum                |  3487.617147 |  2782.382853 |
   |====================|==============|==============|

   交换后:

   |====================|==============|==============|
   | 资产 :             | 用户:        | 资金:        |
   |====================|==============|==============|
   | Gold               |   457.743470 |   388.257870 |
   | Rum                |  3566.446745 |  2703.553256 |
   |====================|==============|==============|

----------------------------------------------------
   ** Δ Change in Constant-Product (K): -0.0000%
    ✔  Try Swap  (9753ms)


  23 passing (2m)

Done in 165.81s.
```
