"use client";

import { Connector, useConnect } from "wagmi";
import { SignInWithBaseButton } from "@base-org/account-ui/react";
import { useState } from "react";

interface SignInWithBaseProps {
  connector: Connector;
}

export function SignInWithBase({ connector }: SignInWithBaseProps) {
  const [verificationResult, setVerificationResult] = useState<string>("");
  const { connect } = useConnect();

  async function handleBaseAccountConnect() {
    try {
      const provider = await connector.getProvider();
      if (!provider) {
        console.error("No provider");
        return;
      }

      // Generate a fresh nonce (this will be overwritten with the backend nonce)
      const clientNonce =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
      console.log("clientNonce", clientNonce);
      
      // Connect with SIWE to get signature, message, and address
      // This wallet_connect request will trigger the connection AND update wagmi's state
      const accounts = await (provider as any).request({
        method: "wallet_connect",
        params: [
          {
            version: "1",
            capabilities: {
              signInWithEthereum: {
                nonce: clientNonce,
                chainId: "0x2105", // Base Mainnet - 8453
              },
            },
          },
        ],
      });

      // After successful wallet_connect, explicitly connect through wagmi to update state
      connect({ connector });

      const walletAddress = accounts.accounts[0].address;
      const signature =
        accounts.accounts[0].capabilities.signInWithEthereum.signature;
      const message =
        accounts.accounts[0].capabilities.signInWithEthereum.message;
      
      // Verify the signature on the backend
      const verifyResponse = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: walletAddress,
          message,
          signature,
        }),
      });

      const result = await verifyResponse.json();

      if (result.success) {
        setVerificationResult(`Verified! Address: ${result.address}`);
      } else {
        setVerificationResult(`Verification failed: ${result.error}`);
      }
    } catch (err) {
      console.error("Error:", err);
      setVerificationResult(
        `Error: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  }

  return (
    <div>
      <div style={{ width: "300px" }}>
        <SignInWithBaseButton
          onClick={handleBaseAccountConnect}
          variant="solid"
          colorScheme="light"
          align="center"
        />
      </div>
      {verificationResult && (
        <div style={{ marginTop: "10px" }}>{verificationResult}</div>
      )}
    </div>
  );
}

