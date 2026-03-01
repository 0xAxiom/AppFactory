import { NextRequest, NextResponse } from 'next/server';

interface EtherscanTx {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  gasPrice: string;
  input: string;
  timeStamp: string;
  isError: string;
}

interface TokenTx {
  tokenSymbol: string;
  tokenName: string;
  tokenDecimal: string;
  from: string;
  to: string;
  value: string;
  hash: string;
  timeStamp: string;
}

const API_KEY = process.env.ETHERSCAN_API_KEY || '';
const BASE_URL = 'https://api.etherscan.io/v2/api';

async function etherscan(
  module: string,
  action: string,
  params: Record<string, string> = {}
) {
  const qs = new URLSearchParams({
    chainid: '8453',
    module,
    action,
    apikey: API_KEY,
    ...params,
  });
  const res = await fetch(`${BASE_URL}?${qs}`, { next: { revalidate: 60 } });
  const data = await res.json();
  return data.result;
}

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get('address');
  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return NextResponse.json({ error: 'Invalid address' }, { status: 400 });
  }

  try {
    const [balance, txList, tokenTxs, internalTxs] = await Promise.all([
      etherscan('account', 'balance', { address }),
      etherscan('account', 'txlist', {
        address,
        startblock: '0',
        endblock: '99999999',
        page: '1',
        offset: '100',
        sort: 'desc',
      }),
      etherscan('account', 'tokentx', {
        address,
        startblock: '0',
        endblock: '99999999',
        page: '1',
        offset: '50',
        sort: 'desc',
      }),
      etherscan('account', 'txlistinternal', {
        address,
        startblock: '0',
        endblock: '99999999',
        page: '1',
        offset: '50',
        sort: 'desc',
      }),
    ]);

    const txs = Array.isArray(txList) ? txList : [];
    const tokens = Array.isArray(tokenTxs) ? tokenTxs : [];
    const internals = Array.isArray(internalTxs) ? internalTxs : [];

    // Compute stats
    const totalTxs = txs.length;
    const gasUsed = txs.reduce(
      (sum: number, tx: EtherscanTx) =>
        sum + Number(tx.gasUsed || 0) * Number(tx.gasPrice || 0),
      0
    );
    const gasETH = gasUsed / 1e18;

    // Unique contracts interacted with
    const contracts = new Set(
      txs
        .filter((tx: EtherscanTx) => tx.to && tx.input !== '0x')
        .map((tx: EtherscanTx) => tx.to.toLowerCase())
    );

    // Activity timeline
    const timestamps = txs.map(
      (tx: EtherscanTx) => Number(tx.timeStamp) * 1000
    );
    const firstTx = timestamps.length ? Math.min(...timestamps) : null;
    const lastTx = timestamps.length ? Math.max(...timestamps) : null;

    // Token diversity
    const uniqueTokens = new Set(tokens.map((t: TokenTx) => t.tokenSymbol));

    // Sent vs received
    const addrLower = address.toLowerCase();
    const sent = txs.filter(
      (tx: EtherscanTx) => tx.from?.toLowerCase() === addrLower
    ).length;
    const received = txs.filter(
      (tx: EtherscanTx) => tx.to?.toLowerCase() === addrLower
    ).length;

    // Recent token transfers
    const recentTokens = tokens.slice(0, 10).map((t: TokenTx) => ({
      symbol: t.tokenSymbol,
      name: t.tokenName,
      from: t.from,
      to: t.to,
      value: (
        Number(t.value) / Math.pow(10, Number(t.tokenDecimal || 18))
      ).toFixed(4),
      hash: t.hash,
      timestamp: Number(t.timeStamp) * 1000,
      direction: t.from?.toLowerCase() === addrLower ? 'out' : 'in',
    }));

    // Recent transactions
    const recentTxs = txs.slice(0, 15).map((tx: EtherscanTx) => ({
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: (Number(tx.value) / 1e18).toFixed(6),
      timestamp: Number(tx.timeStamp) * 1000,
      method:
        tx.functionName?.split('(')[0] ||
        (tx.input === '0x' ? 'transfer' : 'contract'),
      isError: tx.isError === '1',
      gasUsed: Number(tx.gasUsed),
    }));

    // Classify wallet type
    let walletType = 'Unknown';
    if (contracts.size > 20) walletType = 'DeFi Power User';
    else if (contracts.size > 5) walletType = 'Active Trader';
    else if (totalTxs > 50 && contracts.size <= 5) walletType = 'Routine User';
    else if (totalTxs <= 10) walletType = 'Newcomer';
    else walletType = 'Casual User';

    return NextResponse.json({
      address,
      balance: (Number(balance) / 1e18).toFixed(6),
      stats: {
        totalTxs,
        sent,
        received,
        gasSpentETH: gasETH.toFixed(6),
        uniqueContracts: contracts.size,
        uniqueTokens: uniqueTokens.size,
        tokenList: Array.from(uniqueTokens).slice(0, 20),
        firstTx,
        lastTx,
        internalTxCount: internals.length,
      },
      walletType,
      recentTxs,
      recentTokens,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
