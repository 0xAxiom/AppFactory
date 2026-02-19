import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.ETHERSCAN_API_KEY || '';
const BASE_URL = 'https://api.etherscan.io/v2/api';

async function fetchBasescan(params: Record<string, string>) {
  const url = new URL(BASE_URL);
  url.searchParams.set('chainid', '8453');
  url.searchParams.set('apikey', API_KEY);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString(), { next: { revalidate: 30 } });
  return res.json();
}

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get('address');
  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return NextResponse.json({ error: 'Invalid address' }, { status: 400 });
  }

  try {
    const [balanceRes, txRes, tokenTxRes] = await Promise.all([
      fetchBasescan({ module: 'account', action: 'balance', address }),
      fetchBasescan({
        module: 'account',
        action: 'txlist',
        address,
        startblock: '0',
        endblock: '99999999',
        page: '1',
        offset: '10',
        sort: 'desc',
      }),
      fetchBasescan({
        module: 'account',
        action: 'tokentx',
        address,
        startblock: '0',
        endblock: '99999999',
        page: '1',
        offset: '10',
        sort: 'desc',
      }),
    ]);

    const balanceWei = balanceRes.result || '0';
    const balanceEth = (parseFloat(balanceWei) / 1e18).toFixed(6);

    const txs = Array.isArray(txRes.result)
      ? txRes.result.slice(0, 10).map((tx: any) => ({
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: (parseFloat(tx.value) / 1e18).toFixed(4),
          timeStamp: tx.timeStamp,
          isError: tx.isError,
          functionName: tx.functionName?.split('(')[0] || '',
        }))
      : [];

    const tokenTxs = Array.isArray(tokenTxRes.result)
      ? tokenTxRes.result.slice(0, 10).map((tx: any) => ({
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: (
            parseFloat(tx.value) / Math.pow(10, parseInt(tx.tokenDecimal) || 18)
          ).toFixed(4),
          tokenName: tx.tokenName,
          tokenSymbol: tx.tokenSymbol,
          timeStamp: tx.timeStamp,
        }))
      : [];

    return NextResponse.json({ address, balanceEth, txs, tokenTxs });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
