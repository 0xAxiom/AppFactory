'use client';

import { createBaseAccountSDK } from '@base-org/account';
import { useCallback, useEffect, useState } from 'react';
import { baseSepolia } from 'viem/chains';
import { encodeFunctionData, parseUnits } from 'viem';

// USDC contract address on Base Sepolia
const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';
const RECIPIENT_ADDRESS = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045';

// ERC-20 ABI for transfer function
const ERC20_ABI = [
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export default function Home() {
  const [provider, setProvider] = useState<ReturnType<
    ReturnType<typeof createBaseAccountSDK>['getProvider']
  > | null>(null);
  const [connected, setConnected] = useState(false);
  const [universalAddress, setUniversalAddress] = useState<string>('');
  const [subAccountAddress, setSubAccountAddress] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Ready to connect');
  const [amount, setAmount] = useState('1');

  // Initialize SDK with quickstart configuration
  useEffect(() => {
    const initializeSDK = async () => {
      try {
        const sdkInstance = createBaseAccountSDK({
          appName: 'Sub Accounts Example',
          appLogoUrl: 'https://base.org/logo.png',
          appChainIds: [baseSepolia.id],
          // Quickstart configuration
          subAccounts: {
            creation: 'on-connect',
            defaultAccount: 'sub',
          },
        });

        const providerInstance = sdkInstance.getProvider();
        setProvider(providerInstance);
        setStatus('SDK initialized - ready to connect');
      } catch (error) {
        console.error('SDK initialization failed:', error);
        setStatus('SDK initialization failed');
      }
    };

    initializeSDK();
  }, []);

  const connectWallet = async () => {
    if (!provider) {
      setStatus('Provider not initialized');
      return;
    }

    setLoading(true);
    setStatus('Connecting wallet and creating sub account...');

    try {
      // With quickstart config, this will automatically create a sub account
      const connectedAccounts = (await provider.request({
        method: 'wallet_connect',
        params: [],
      })) as string[];

      const accounts = (await provider.request({
        method: 'eth_requestAccounts',
        params: [],
      })) as string[];

      // With defaultAccount: 'sub', the sub account is the first account
      const subAddr = accounts[0];
      const universalAddr = accounts[1];

      setSubAccountAddress(subAddr);
      setUniversalAddress(universalAddr);
      setConnected(true);
      setStatus('Connected! Sub Account automatically created');
    } catch (error) {
      console.error('Connection failed:', error);
      setStatus(
        `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setLoading(false);
    }
  };

  const sendUSDC = useCallback(async () => {
    if (!provider || !subAccountAddress) {
      setStatus('Not connected or sub account not available');
      return;
    }

    setLoading(true);
    setStatus('Preparing USDC transfer...');

    try {
      // Parse amount (USDC has 6 decimals)
      const amountInUnits = parseUnits(amount, 6);

      // Encode the transfer function call
      const data = encodeFunctionData({
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [RECIPIENT_ADDRESS as `0x${string}`, amountInUnits],
      });

      setStatus('Sending transaction...');

      // Send the transaction using wallet_sendCalls
      const callsId = (await provider.request({
        method: 'wallet_sendCalls',
        params: [
          {
            version: '2.0',
            atomicRequired: true,
            chainId: `0x${baseSepolia.id.toString(16)}`,
            from: subAccountAddress,
            calls: [
              {
                to: USDC_ADDRESS,
                data: data,
                value: '0x0',
              },
            ],
            capabilities: {
              // Optional: Add paymaster URL here to sponsor gas
              // paymasterUrl: "your-paymaster-url",
            },
          },
        ],
      })) as string;

      setStatus(`Transaction sent! Calls ID: ${callsId}`);
    } catch (error) {
      console.error('Transaction failed:', error);
      setStatus(
        `Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setLoading(false);
    }
  }, [provider, subAccountAddress, amount]);

  return (
    <div className="container">
      <h1 className="title">Sub Accounts Example</h1>
      <p className="subtitle">
        Demonstrating automatic sub account creation and USDC transfers on Base
        Sepolia
      </p>

      <div className="card">
        <div className="status-message">{status}</div>

        {!connected ? (
          <button
            onClick={connectWallet}
            disabled={loading || !provider}
            className="button"
          >
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </button>
        ) : (
          <>
            <div className="section-title">Account Information</div>

            <div className="info-row">
              <span className="info-label">Sub Account Address:</span>
              <span className="info-value">{subAccountAddress}</span>
            </div>

            <div className="info-row">
              <span className="info-label">Universal Account Address:</span>
              <span className="info-value">{universalAddress}</span>
            </div>

            <div style={{ marginTop: '32px' }}>
              <div className="section-title">Send USDC</div>

              <div className="info-row">
                <span className="info-label">Recipient:</span>
                <span className="info-value">{RECIPIENT_ADDRESS}</span>
              </div>

              <div className="input-group">
                <label className="input-label">Amount (USDC):</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="1"
                  step="0.01"
                  min="0"
                  className="input"
                  disabled={loading}
                />
              </div>

              <button
                onClick={sendUSDC}
                disabled={loading || !amount || parseFloat(amount) <= 0}
                className="button"
              >
                {loading ? 'Sending...' : `Send ${amount} USDC`}
              </button>

              <div
                style={{ marginTop: '16px', fontSize: '0.85rem', opacity: 0.8 }}
              >
                <p>• This will send USDC from your Sub Account</p>
                <p>
                  • Auto Spend Permissions will request funds from your
                  Universal Account if needed
                </p>
                <p>
                  • Make sure you have USDC in your Universal Account on Base
                  Sepolia
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="card">
        <div className="section-title">About This Demo</div>
        <p style={{ lineHeight: '1.6', opacity: 0.9 }}>
          This app demonstrates the <strong>quickstart approach</strong> to Sub
          Accounts integration:
        </p>
        <ul
          style={{
            marginTop: '12px',
            marginLeft: '20px',
            lineHeight: '1.8',
            opacity: 0.9,
          }}
        >
          <li>Sub Account is automatically created when you connect</li>
          <li>All transactions are sent from the Sub Account by default</li>
          <li>
            Auto Spend Permissions allow accessing Universal Account balance
          </li>
          <li>No repeated approval prompts for transactions</li>
        </ul>
      </div>
    </div>
  );
}
