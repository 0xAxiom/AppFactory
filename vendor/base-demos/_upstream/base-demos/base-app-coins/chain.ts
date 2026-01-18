import { createPublicClient, http, getContract } from "viem"
import { base } from "viem/chains"
import { UniswapV4ABI, UniswapV4PoolManager, StateViewABI, UniswapV4StateView } from "./univ4"

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