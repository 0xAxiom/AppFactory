"use client";

import React, { useState } from "react";
import { createBaseAccountSDK } from "@base-org/account";

interface SignInWithBaseProps {
  onSignIn: (address: string) => void;
  colorScheme?: "light" | "dark";
}

export const SignInWithBaseButton = ({
  onSignIn,
  colorScheme = "light",
}: SignInWithBaseProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const isLight = colorScheme === "light";

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      // Initialize the SDK
      const provider = createBaseAccountSDK({
        appName: "Zora Creator Coins Agent",
      }).getProvider();

      // 1 — Get a fresh nonce from the server
      const nonceResponse = await fetch('/api/auth/verify', { method: 'GET' });
      const { nonce } = await nonceResponse.json();
      
      console.log('Using nonce:', nonce);

      const ethRequestAccountsResponse = await provider.request({
        method: "eth_requestAccounts",
      })

      console.log('Eth request accounts response:', ethRequestAccountsResponse);

      const switchChainResponse = await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: '0x2105' }],
      })

      console.log('Switch chain response:', switchChainResponse);

      // 2 — Connect and get address
      const connectResponse = await provider.request({
        method: "wallet_connect",
        params: [
          {
            version: "1",
            capabilities: {
              signInWithEthereum: {
                chainId: '0x2105',
                nonce,
              },
            },
          },
        ],
      }) as { 
        accounts: { address: string }[], 
        signInWithEthereum?: { 
          message: string, 
          signature: string 
        } 
      };

      console.log("Connect response:", connectResponse);
      const { address } = connectResponse.accounts[0];

      // 3 — Check if we got SIWE data from the response
      if (connectResponse.signInWithEthereum) {
        const { message, signature } = connectResponse.signInWithEthereum;
        console.log('SIWE message:', message);
        console.log('SIWE signature:', signature);

        // 4 — Verify signature on the server
        const verifyResponse = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address, message, signature })
        });

        const verifyData = await verifyResponse.json();
        
        if (!verifyData.ok) {
          throw new Error(verifyData.error || 'Signature verification failed');
        }

        console.log("✅ Signature verified successfully!");
      } else {
        // Fallback: manual signing if SIWE not available
        console.log("⚠️ SIWE not available, using manual signing");
        
        // Create SIWE message manually
        const domain = window.location.host;
        const uri = window.location.origin;
        const message = `${domain} wants you to sign in with your Ethereum account:\n${address}\n\nAgent Spend Permissions Authentication\n\nURI: ${uri}\nVersion: 1\nChain ID: 8453\nNonce: ${nonce}\nIssued At: ${new Date().toISOString()}`;
        
        // Request signature
        const signature = await provider.request({
          method: 'personal_sign',
          params: [message, address]
        });

        // Verify signature on server
        const verifyResponse = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address, message, signature })
        });

        const verifyData = await verifyResponse.json();
        
        if (!verifyData.ok) {
          throw new Error(verifyData.error || 'Signature verification failed');
        }

        console.log("✅ Manual signature verified successfully!");
      }

      console.log("✅ Authentication complete for address:", address);
      onSignIn(address);
    } catch (err) {
      console.error("Sign in failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignIn}
      disabled={isLoading}
      className={`
        flex items-center justify-center gap-2 px-8 py-5 rounded-lg cursor-pointer 
        font-medium text-lg min-w-64 h-14 transition-all duration-200
        ${
          isLight
            ? "bg-white text-black border-2 border-gray-200 hover:bg-gray-50"
            : "bg-black text-white border-2 border-gray-700 hover:bg-gray-900"
        }
        ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <div
        className={`
        w-4 h-4 rounded-sm flex-shrink-0
        ${isLight ? "bg-base-blue" : "bg-white"}
      `}
      />
      <span>{isLoading ? "Signing in..." : "Sign in with Base"}</span>
    </button>
  );
};
