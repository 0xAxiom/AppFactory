import { NextResponse } from 'next/server';

const BASE_RPC = 'https://mainnet.base.org';
const WHALE_THRESHOLD = 1; // 1 ETH minimum

async function rpcCall(method: string, params: unknown[]) {
  const res = await fetch(BASE_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 }),
  });
  const data = await res.json();
  return data.result;
}

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get latest block
    const latestHex = await rpcCall('eth_blockNumber', []);
    const latestBlock = parseInt(latestHex, 16);

    // Fetch last 5 blocks for whale txs
    const whales: Array<{
      hash: string;
      from: string;
      to: string;
      ethValue: number;
      timestamp: number;
      block: number;
      type: string;
    }> = [];

    const blockPromises = [];
    for (let i = 0; i < 5; i++) {
      const blockNum = `0x${(latestBlock - i).toString(16)}`;
      blockPromises.push(rpcCall('eth_getBlockByNumber', [blockNum, true]));
    }

    const blocks = await Promise.all(blockPromises);

    for (const block of blocks) {
      if (!block?.transactions) continue;
      const blockTs = parseInt(block.timestamp, 16) * 1000;
      const blockNum = parseInt(block.number, 16);

      for (const tx of block.transactions) {
        const ethValue = parseInt(tx.value, 16) / 1e18;
        if (ethValue >= WHALE_THRESHOLD) {
          whales.push({
            hash: tx.hash,
            from: tx.from,
            to: tx.to || 'Contract Creation',
            ethValue,
            timestamp: blockTs,
            block: blockNum,
            type: 'transfer',
          });
        }
      }
    }

    // Sort by value descending
    whales.sort((a, b) => b.ethValue - a.ethValue);

    // Get ETH price from CoinGecko (free)
    let ethPrice = 2700;
    try {
      const priceRes = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
        { next: { revalidate: 60 } }
      );
      const priceData = await priceRes.json();
      ethPrice = priceData.ethereum?.usd || 2700;
    } catch {
      // fallback price
    }

    return NextResponse.json({
      whales: whales.slice(0, 25),
      ethPrice,
      latestBlock,
      blocksScanned: 5,
      threshold: WHALE_THRESHOLD,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Whale API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch whale data' },
      { status: 500 }
    );
  }
}
