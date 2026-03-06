import { NextResponse } from 'next/server';

const BASE_RPC = 'https://mainnet.base.org';

async function rpcCall(method: string, params: unknown[] = []) {
  const res = await fetch(BASE_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  const data = await res.json();
  return data.result;
}

export async function GET() {
  try {
    const [blockHex, gasPriceHex] = await Promise.all([
      rpcCall('eth_blockNumber'),
      rpcCall('eth_gasPrice'),
    ]);

    const blockNumber = parseInt(blockHex, 16);
    const gasPrice = parseInt(gasPriceHex, 16);
    const gasPriceGwei = (gasPrice / 1e9).toFixed(4);

    // Get block to estimate TPS
    const block = await rpcCall('eth_getBlockByNumber', [blockHex, false]);
    const txCount = block?.transactions?.length ?? 0;
    const timestamp = parseInt(block?.timestamp ?? '0', 16);

    // Get previous block for time delta
    const prevBlockHex = '0x' + (blockNumber - 1).toString(16);
    const prevBlock = await rpcCall('eth_getBlockByNumber', [
      prevBlockHex,
      false,
    ]);
    const prevTimestamp = parseInt(prevBlock?.timestamp ?? '0', 16);
    const blockTime = timestamp - prevTimestamp || 2;
    const tps = (txCount / blockTime).toFixed(1);

    return NextResponse.json({
      blockNumber,
      gasPrice: gasPriceGwei,
      txCount,
      tps,
      blockTime,
      timestamp,
    });
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to fetch Base stats' },
      { status: 500 }
    );
  }
}
