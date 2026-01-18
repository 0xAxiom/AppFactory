"use client";

import { useState } from "react";
import { useSendCalls, useAccount } from "wagmi";
import { encodeFunctionData, parseUnits } from "viem";
import { baseSepolia } from "wagmi/chains";

// USDC contract address on Base Sepolia
const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";

// NFT contract address on Base Sepolia
const NFT_CONTRACT_ADDRESS = "0x82039e7C37D7aAc98D0F4d0A762F4E0d8c8DC273";

// ERC20 ABI for the transfer, approve, and transferFrom functions
const erc20Abi = [
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  }
] as const;

// ERC721 ABI for the mint function
const erc721Abi = [
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "tokenId", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export function BatchTransactions() {
  const { sendCalls, data, isPending, isSuccess, error } = useSendCalls();
  const account = useAccount();
  const [approvalAmount, setApprovalAmount] = useState("1");
  const [tokenId, setTokenId] = useState("1");
  const [usePaymaster, setUsePaymaster] = useState(false);

  async function handleBatchTransfer() {
    try {
      // Get the user's address
      const userAddress = account.addresses?.[0];
      if (!userAddress) {
        console.error("No user address found");
        return;
      }

      // Encode the first approve call - approve USDC to NFT contract
      const call1Data = encodeFunctionData({
        abi: erc20Abi,
        functionName: "approve",
        args: [
          NFT_CONTRACT_ADDRESS,
          parseUnits(approvalAmount, 6), // USDC has 6 decimals
        ],
      });

      // Encode the second call - mint NFT to the user's address
      const call2Data = encodeFunctionData({
        abi: erc721Abi,
        functionName: "mint",
        args: [
          userAddress as `0x${string}`,
          BigInt(tokenId),
        ],
      });

      // Prepare capabilities object if paymaster is enabled
      const capabilities = usePaymaster
        ? {
            paymasterService: {
              url: process.env.NEXT_PUBLIC_PAYMASTER_URL || "https://api.developer.coinbase.com/rpc/v1/base-sepolia",
            },
          }
        : undefined;

      // Send the batch of calls
      sendCalls({
        calls: [
          {
            to: USDC_ADDRESS,
            data: call1Data,
          },
          {
            to: NFT_CONTRACT_ADDRESS,
            data: call2Data,
          },
        ],
        chainId: baseSepolia.id,
        capabilities,
      });
    } catch (err) {
      console.error("Error batching transactions:", err);
    }
  }

  return (
    <div>
      <h2 style={styles.title}>🎨 Approve USDC & Mint NFT</h2>
      <p style={styles.description}>
        Batch approve USDC and mint an NFT in a single transaction
      </p>

      <div style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>USDC Approval Amount</label>
          <input
            type="number"
            value={approvalAmount}
            onChange={(e) => setApprovalAmount(e.target.value)}
            placeholder="1"
            step="0.000001"
            min="0"
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>NFT Token ID</label>
          <input
            type="number"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            placeholder="1"
            step="1"
            min="0"
            style={styles.input}
          />
        </div>

        <div style={styles.infoBox}>
          <span style={styles.infoIcon}>ℹ️</span>
          <span>NFT will be minted to your connected address</span>
        </div>

        <div style={styles.checkboxGroup}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={usePaymaster}
              onChange={(e) => setUsePaymaster(e.target.checked)}
              style={styles.checkbox}
            />
            <span>Use Paymaster (sponsor gas fees)</span>
          </label>
        </div>

        <button
          onClick={handleBatchTransfer}
          disabled={isPending || !account.address}
          style={{
            ...styles.button,
            ...(isPending || !account.address ? styles.buttonDisabled : {}),
          }}
        >
          {isPending ? "⏳ Processing..." : "🚀 Approve & Mint NFT"}
        </button>
      </div>

      {isPending && (
        <div style={styles.statusBox}>
          <div style={styles.spinner}></div>
          <p style={styles.statusText}>Transaction pending...</p>
        </div>
      )}

      {isSuccess && data && (
        <div style={styles.successBox}>
          <div style={styles.successIcon}>✓</div>
          <p style={styles.successTitle}>Batch sent successfully!</p>
          <p style={styles.successId}>Batch ID: {data.id}</p>
        </div>
      )}

      {error && (
        <div style={styles.errorBox}>
          <span style={styles.errorIcon}>⚠️</span>
          <span>{error.message}</span>
        </div>
      )}
    </div>
  );
}

const styles = {
  title: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#1f2937",
    margin: "0 0 0.5rem 0",
  } as React.CSSProperties,
  description: {
    color: "#6b7280",
    marginBottom: "2rem",
    fontSize: "0.95rem",
  } as React.CSSProperties,
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  } as React.CSSProperties,
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  } as React.CSSProperties,
  label: {
    fontWeight: "500",
    color: "#374151",
    fontSize: "0.875rem",
  } as React.CSSProperties,
  input: {
    padding: "0.75rem 1rem",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "1rem",
    transition: "all 0.2s",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  } as React.CSSProperties,
  infoBox: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "1rem",
    backgroundColor: "#eff6ff",
    borderRadius: "8px",
    fontSize: "0.875rem",
    color: "#1e40af",
  } as React.CSSProperties,
  infoIcon: {
    fontSize: "1.25rem",
  } as React.CSSProperties,
  checkboxGroup: {
    display: "flex",
    alignItems: "center",
    padding: "1rem",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
  } as React.CSSProperties,
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    cursor: "pointer",
    fontSize: "0.95rem",
    color: "#374151",
  } as React.CSSProperties,
  checkbox: {
    width: "1.25rem",
    height: "1.25rem",
    cursor: "pointer",
  } as React.CSSProperties,
  button: {
    width: "100%",
    padding: "1rem",
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
    marginTop: "0.5rem",
  } as React.CSSProperties,
  buttonDisabled: {
    backgroundColor: "#9ca3af",
    cursor: "not-allowed",
    opacity: 0.6,
  } as React.CSSProperties,
  statusBox: {
    marginTop: "1.5rem",
    padding: "1.5rem",
    backgroundColor: "#dbeafe",
    borderRadius: "8px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
  } as React.CSSProperties,
  spinner: {
    width: "24px",
    height: "24px",
    border: "3px solid #60a5fa",
    borderTop: "3px solid transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  } as React.CSSProperties,
  statusText: {
    color: "#1e40af",
    fontWeight: "500",
    margin: 0,
  } as React.CSSProperties,
  successBox: {
    marginTop: "1.5rem",
    padding: "1.5rem",
    backgroundColor: "#d1fae5",
    borderRadius: "8px",
    textAlign: "center",
  } as React.CSSProperties,
  successIcon: {
    display: "inline-block",
    width: "48px",
    height: "48px",
    backgroundColor: "#10b981",
    color: "white",
    borderRadius: "50%",
    lineHeight: "48px",
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "0.75rem",
  } as React.CSSProperties,
  successTitle: {
    color: "#065f46",
    fontWeight: "600",
    margin: "0 0 0.5rem 0",
    fontSize: "1.1rem",
  } as React.CSSProperties,
  successId: {
    color: "#047857",
    fontSize: "0.875rem",
    margin: 0,
    wordBreak: "break-all",
  } as React.CSSProperties,
  errorBox: {
    marginTop: "1.5rem",
    padding: "1rem",
    backgroundColor: "#fee2e2",
    borderRadius: "8px",
    color: "#991b1b",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  } as React.CSSProperties,
  errorIcon: {
    fontSize: "1.25rem",
  } as React.CSSProperties,
};

