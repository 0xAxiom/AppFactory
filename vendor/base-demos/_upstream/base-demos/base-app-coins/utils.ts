import { Ether, Token, type Currency } from "@uniswap/sdk-core";
import { Pool, type PoolKey } from "@uniswap/v4-sdk";
import { erc20Abi, getContract, parseAbi, zeroAddress } from "viem";
import { base } from "viem/chains";
import { publicClient, stateView } from "./chain";
import { ADDRESS_ZERO } from "@uniswap/v3-sdk";

const BASE_PLATFORM_REFERRER = "0x55C88bB05602Da94fCe8FEadc1cbebF5B72c2453";

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

    const [currency0PlatformReferrer, currency1PlatformReferrer] = await Promise.all([
        tryGetPlatformReferrer(pool.currency0.wrapped.address),
        tryGetPlatformReferrer(pool.currency1.wrapped.address)
    ])

    if ([currency0PlatformReferrer, currency1PlatformReferrer].includes(BASE_PLATFORM_REFERRER)) {
        return "TBA"
    }

    return "ZORA"
}

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