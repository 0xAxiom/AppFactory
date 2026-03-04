import { NextResponse } from 'next/server';

// Uniswap V3 Router on Base
const UNISWAP_ROUTER = '0x2626664c2603336E57B271c5C0b26F421741e481';
const BASE_CHAIN_ID = 8453;

interface EtherscanTx {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
  gasUsed: string;
  gasPrice: string;
  functionName: string;
  isError: string;
  blockNumber: string;
}

export async function GET() {
  const apiKey = process.env.ETHERSCAN_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'No API key configured' },
      { status: 500 }
    );
  }

  try {
    const url = `https://api.etherscan.io/v2/api?chainid=${BASE_CHAIN_ID}&module=account&action=txlist&address=${UNISWAP_ROUTER}&page=1&offset=50&sort=desc&apikey=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 30 } });
    const data = await res.json();

    if (data.status !== '1' || !data.result) {
      return NextResponse.json({
        swaps: [],
        message: data.message || 'No data',
      });
    }

    const swaps = (data.result as EtherscanTx[])
      .filter((tx: EtherscanTx) => tx.isError === '0' && tx.value !== '0')
      .map((tx: EtherscanTx) => ({
        hash: tx.hash,
        from: tx.from,
        value: (parseInt(tx.value) / 1e18).toFixed(6),
        timestamp: parseInt(tx.timeStamp),
        gasUsed: tx.gasUsed,
        gasPrice: (parseInt(tx.gasPrice) / 1e9).toFixed(2),
        block: tx.blockNumber,
        method: tx.functionName?.split('(')[0] || 'swap',
      }));

    return NextResponse.json({ swaps, count: swaps.length });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch swaps', detail: String(err) },
      { status: 500 }
    );
  }
}
