# Zora & Base App Coin Pool Discovery

A developer starter guide for identifying and analyzing Uniswap V4 pools containing Zora ecosystem tokens and Base App (TBA) coins on Base chain.

## Overview

This project demonstrates how to:
- Monitor Uniswap V4 pool creation events
- Identify pools containing Zora Creator Coins, Zora V4 Coins, and Base App tokens
- Extract comprehensive metadata about these pools for analysis
- Classify tokens based on their hook contracts and pairing patterns

## Architecture

### Core Components

#### 1. Event Monitoring (`index.ts`)
The main entry point scans Uniswap V4 `Initialize` events within a specified block range to discover newly created pools.

```typescript
const logs = await publicClient.getContractEvents({
    abi: UniswapV4ABI,
    address: UniswapV4PoolManager,
    fromBlock: START_BLOCK_NUMBER,
    toBlock: END_BLOCK_NUMBER,
    eventName: "Initialize"
})

const poolKeys = logs.map((log) => {
    return {
        currency0: log.args.currency0,
        currency1: log.args.currency1,
        fee: log.args.fee,
        tickSpacing: log.args.tickSpacing,
        hooks: log.args.hooks
    }
}) as PoolKey[]
```

**Key aspects:**
- Uses `publicClient.getContractEvents()` to fetch pool initialization events
- Filters events from the Uniswap V4 PoolManager contract
- Extracts pool keys (currency0, currency1, fee, tickSpacing, hooks) from event logs

#### 2. Pool Data Loading (`utils.ts`)
Contains utilities for enriching pool data with on-chain information.

```typescript
export async function loadData(key: PoolKey) {
    const [currency0, currency1] = await Promise.all([
        getCurrency(key.currency0),
        getCurrency(key.currency1)
    ])

    const poolId = Pool.getPoolId(currency0, currency1, key.fee, key.tickSpacing, key.hooks) as `0x${string}`;
    const [sqrtPriceX96, tick, _protocolFee, _lpFee] = await stateView.read.getSlot0([poolId]);
    const liquidity = await stateView.read.getLiquidity([poolId])

    const pool = new Pool(
        currency0,
        currency1,
        key.fee,
        key.tickSpacing,
        key.hooks,
        sqrtPriceX96.toString(),
        liquidity.toString(),
        tick,
    )
    return pool;
}
```

**Currency Resolution:**
```typescript
export async function getCurrency(address: string): Promise<Currency> {
    if (address === zeroAddress) {
        return Ether.onChain(base.id);
    }

    const erc20 = getContract({
        abi: erc20Abi,
        address: address as `0x${string}`,
        client: publicClient
    })

    const [name, symbol, decimals] = await Promise.all([
        erc20.read.name(),
        erc20.read.symbol(),
        erc20.read.decimals()
    ])

    return new Token(base.id, address, decimals, symbol, name)
}
```

**Technical details:**
- Uses Uniswap V4 StateView contract for efficient state queries
- Handles both ERC20 tokens and native ETH (zero address)
- Leverages parallel async operations for performance

#### 3. Token Classification Logic

```typescript
let coinType: string | undefined;
if (key.hooks === "0xd61A675F8a0c67A73DC3B54FB7318B4D91409040") {
    coinType = "ZORA_CREATOR_COIN"
} else if (key.hooks === "0x9ea932730A7787000042e34390B8E435dD839040") {
    coinType = "ZORA_V4_COIN"
}

if (!coinType) continue;

// Detect if the coin is coming from Base App or Zora
const appType = await categorizeAppType(pool);
```

**Base App Token Detection:**
```typescript

export async function categorizeAppType(pool: Pool) {
    async function tryGetPlatformReferrer(address: string) {
        const zoraBaseCoin = getContract({
            abi: parseAbi([
                "function platformReferrer() view returns (address)",
            ]),
            address: address as `0x${string}`,
            client: publicClient
        })

        try {
            const platformReferrer = await zoraBaseCoin.read.platformReferrer()
            return platformReferrer
        } catch (error) {
            return ADDRESS_ZERO
        }
    }

    // Try to fetch `platformReferrer()` on both currencies in the Pool
    // falling back to ADDRESS_ZERO if the function does not exist (currency is not a Zora coin)
    const [currency0PlatformReferrer, currency1PlatformReferrer] = await Promise.all([
        tryGetPlatformReferrer(pool.currency0.wrapped.address),
        tryGetPlatformReferrer(pool.currency1.wrapped.address)
    ])

    // If either of the currencies has the Base App referrer address,
    // the coin is coming from the Base App
    if ([currency0PlatformReferrer, currency1PlatformReferrer].includes(BASE_PLATFORM_REFERRER)) {
        return "TBA"
    }

    return "ZORA"
}
```

#### 4. Liquidity Calculations

```typescript
const priceUpper = TickMath.getSqrtRatioAtTick(TickMath.MAX_TICK)
const priceLower = TickMath.getSqrtRatioAtTick(TickMath.MIN_TICK)

const amount0 = SqrtPriceMath.getAmount0Delta(pool.sqrtRatioX96, priceUpper, pool.liquidity, true);
const amount1 = SqrtPriceMath.getAmount1Delta(priceLower, pool.sqrtRatioX96, pool.liquidity, true)

const amount0HumanReadable = formatUnits(BigInt(amount0.toString()), pool.currency0.decimals);
const amount1HumanReadable = formatUnits(BigInt(amount1.toString()), pool.currency1.decimals);
```

#### 5. Blockchain Connection (`chain.ts`)

```typescript
export const publicClient = createPublicClient({
    chain: base,
    transport: http(process.env.RPC_URL)
})

export const uniswapv4 = getContract({
    abi: UniswapV4ABI,
    client: publicClient,
    address: UniswapV4PoolManager
})

export const stateView = getContract({
    abi: StateViewABI,
    address: UniswapV4StateView,
    client: publicClient
})
```

## Token Classification Logic

### Zora Ecosystem Tokens

The project identifies Zora tokens by their hook contract addresses:

- **ZORA_CREATOR_COIN**: `0xd61A675F8a0c67A73DC3B54FB7318B4D91409040`
- **ZORA_V4_COIN**: `0x9ea932730A7787000042e34390B8E435dD839040`

These hooks are deployed by Zora and used to create pools for their token ecosystems.

### Base App (TBA) Classification

**Detection Method**: Base App coins are identified by their platform referrer address.

The classification logic checks the platform referrer address associated with the pool to determine if it's a Base App coin versus a pure Zora ecosystem token.

## Alternative Implementation Approaches

### Event Data Sources

This implementation uses direct JSON-RPC calls via Viem, but you can adapt it for other data sources:

**Subgraphs**: If you're already using The Graph Protocol, modify the event fetching logic to query a Uniswap V4 subgraph instead of making direct RPC calls. Replace the `getContractEvents` call with GraphQL queries.

**Indexing Services**: For projects using Alchemy, Moralis, or similar services, substitute their event APIs while maintaining the same pool key extraction logic.

**Real-time Monitoring**: Convert from batch processing to real-time by setting up WebSocket subscriptions to new block events and processing pools as they're created.

### Data Storage

The current implementation prints metadata to console, but you might want to:
- Store results in a database for persistent analysis
- Send data to external APIs or webhooks
- Cache results to avoid re-processing known pools

### Network Support

While this focuses on Base chain, the pattern applies to any network with Uniswap V4 deployments. Update the chain configuration and contract addresses accordingly.

## Metadata Object Reference

The output metadata object contains the following fields:

```typescript
const metadata = {
    id: pool.poolId,
    key: pool.poolKey,
    currency0: {
        name: pool.currency0.name,
        symbol: pool.currency0.symbol,
        decimals: pool.currency0.decimals,
        address: pool.currency0.wrapped.address,
    },
    currency1: {
        name: pool.currency1.name,
        symbol: pool.currency1.symbol,
        decimals: pool.currency1.decimals,
        address: pool.currency1.wrapped.address,
    },
    sqrtPriceX96: pool.sqrtRatioX96.toString(),
    tick: pool.tickCurrent,
    liquidity: pool.liquidity.toString(),
    liquidityCurrency0: amount0.toString(),
    liquidityCurrency1: amount1.toString(),
    liquidityCurrency0HumanReadable: `${amount0HumanReadable} ${pool.currency0.symbol}`,
    liquidityCurrency1HumanReadable: `${amount1HumanReadable} ${pool.currency1.symbol}`,
    currency0Price,
    currency1Price,
    currency0PriceHumanReadable: `1 ${pool.currency0.symbol} = ${currency0Price} ${pool.currency1.symbol}`,
    currency1PriceHumanReadable: `1 ${pool.currency1.symbol} = ${currency1Price} ${pool.currency0.symbol}`,
    coinType,
    appType
}
```

### Pool Identifiers
- `id`: Unique pool identifier hash
- `key`: Complete pool key object with currencies, fee, tickSpacing, and hooks

### Currency Information
- `currency0/currency1.name`: Human-readable token name
- `currency0/currency1.symbol`: Token symbol (e.g., "USDC", "WETH")
- `currency0/currency1.decimals`: Token decimal places for formatting
- `currency0/currency1.address`: Contract address

### Price Data
- `sqrtPriceX96`: Current pool price in Uniswap's sqrt format
- `tick`: Current tick (logarithmic price representation)
- `currency0Price`: Price of currency0 in terms of currency1
- `currency1Price`: Price of currency1 in terms of currency0
- `currency0PriceHumanReadable`: Formatted price string
- `currency1PriceHumanReadable`: Formatted price string

### Liquidity Metrics
- `liquidity`: Total pool liquidity in Uniswap's internal format
- `liquidityCurrency0`: Amount of currency0 in the pool (raw)
- `liquidityCurrency1`: Amount of currency1 in the pool (raw)
- `liquidityCurrency0HumanReadable`: Formatted amount with symbol
- `liquidityCurrency1HumanReadable`: Formatted amount with symbol

### Classification
- `coinType`: Type of Zora token ("ZORA_CREATOR_COIN" or "ZORA_V4_COIN")
- `appType`: Application ecosystem ("ZORA" or "TBA")

## Use Cases for Metadata

### Analytics & Monitoring
- **Price Tracking**: Monitor token prices and price movements over time
- **Liquidity Analysis**: Track total value locked (TVL) in various token pools
- **Market Discovery**: Identify new tokens entering the ecosystem

### Trading & DeFi
- **Arbitrage Detection**: Compare prices across different pools or DEXs
- **Liquidity Provider Analysis**: Evaluate pool attractiveness for LP positions
- **Volume Analysis**: Track trading activity in specific token categories

### Ecosystem Analysis
- **Token Categorization**: Understand which tokens belong to which ecosystems
- **Adoption Metrics**: Monitor growth of Zora and Base App token usage
- **Cross-chain Comparison**: Compare activity across different networks

### Integration Projects
- **Portfolio Tracking**: Include Zora/Base App tokens in portfolio management apps
- **Wallet Integration**: Enhance wallet UIs with ecosystem-specific token information
- **DeFi Protocols**: Build lending, staking, or yield farming products around these tokens

## Configuration

### Environment Variables
- `RPC_URL`: Base chain RPC endpoint (required)

### Block Range
Modify `START_BLOCK_NUMBER` and `END_BLOCK_NUMBER` in `index.ts` to scan different ranges or implement continuous monitoring.

### Hook Addresses
Add new hook addresses to the classification logic as new Zora contracts are deployed.

## Getting Started

```bash
# Install dependencies
bun install

# Set your RPC URL
export RPC_URL="your-base-rpc-endpoint"

# Run the scanner
bun run index.ts
```

The output will display metadata for each discovered pool that matches the classification criteria.

## Extensions & Modifications

This starter guide can be extended in many ways:
- Add support for additional hook contracts as they're deployed
- Implement more sophisticated Base App detection logic
- Include historical price and volume data
- Add alerts for significant liquidity changes
- Build web interfaces for browsing discovered pools
- Integrate with portfolio tracking or trading applications

The modular structure makes it easy to adapt individual components while maintaining the core pool discovery and classification logic.