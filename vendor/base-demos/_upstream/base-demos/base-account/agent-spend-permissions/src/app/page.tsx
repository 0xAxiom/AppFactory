'use client'

import React, { useState, useEffect } from 'react'
import { SignInWithBaseButton } from '@/components/SignInWithBase'
import { ChatInterface } from '@/components/ChatInterface'
import { SpendPermissionSetup } from '@/components/SpendPermissionSetup'
import { SpendPermissionManager } from '@/components/SpendPermissionManager'

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userAddress, setUserAddress] = useState<string>()
  const [hasSpendPermission, setHasSpendPermission] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      // This would typically check for a valid session
      // For now, we'll just set loading to false
      setIsLoading(false)
    } catch (error) {
      console.error('Auth check error:', error)
      setIsLoading(false)
    }
  }

  const handleSignIn = async (address: string) => {
    // Signature verification is now handled in the SignInWithBase component
    // If we reach this point, the user has been successfully authenticated
    console.log('User authenticated with address:', address)
    setIsAuthenticated(true)
    setUserAddress(address)
  }

  const handlePermissionGranted = () => {
    setHasSpendPermission(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-base-blue"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Zora Coins Agent</h1>
              <p className="text-gray-600">Buy any creator coin with your Base Account</p>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/base/demos/tree/master/base-account/agent-spend-permissions"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                View Code
              </a>
              {isAuthenticated && (
                <div className="text-sm text-gray-600">
                  {userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isAuthenticated ? (
          <div className="text-center">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to Zora Coins Agent
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Start buying creator coins with your Base Account.
              </p>
              <div className="mb-8 flex justify-center">
                <SignInWithBaseButton onSignIn={handleSignIn} colorScheme="light" />
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-base-blue rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Sign In</h3>
                <p className="text-sm text-gray-600">Sign in with your Base Account</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-base-blue rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Set Permissions</h3>
                <p className="text-sm text-gray-600">Configure your daily spend permissions ($1-$2)</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-base-blue rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Buy Coins</h3>
                <p className="text-sm text-gray-600">Chat with the agent to buy Zora creator coins</p>
              </div>
            </div>
          </div>
        ) : !hasSpendPermission ? (
          <div className="text-center">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Almost Ready!
              </h2>
              <p className="text-gray-600 mb-8">
                Set up your spending permissions to start using the agent.
              </p>
            </div>
            <SpendPermissionSetup 
              userAddress={userAddress!} 
              onPermissionGranted={handlePermissionGranted} 
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Interface - Left Side (2/3 width) */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 chat-container overflow-hidden h-[600px]">
                <ChatInterface isAuthenticated={isAuthenticated} userAddress={userAddress} />
              </div>
            </div>
            
            {/* Spend Permission Manager - Right Side (1/3 width) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden h-[600px]">
                <SpendPermissionManager 
                  isAuthenticated={isAuthenticated}
                  userAddress={userAddress}
                />
              </div>
            </div>
          </div>
        )}

        {/* How It Works Diagram - Only show on landing page */}
        {!isAuthenticated && (
          <div className="mt-16 bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
          
          <div className="max-w-4xl mx-auto">
            {/* Flow Diagram */}
            <div className="relative">
              {/* Step 1: User */}
              <a 
                href="https://docs.base.org/base-account/overview/what-is-base-account?utm_source=x&utm_medium=video&utm_campaign=spend-permissions-youssef" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center mb-8 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer group"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:bg-blue-600 transition-colors">
                    👤
                  </div>
                </div>
                <div className="ml-6 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">Base Account</h3>
                  <p className="text-gray-600">Signs in with Base Account and grants spend permission to server wallet</p>
                </div>
                <div className="hidden md:block">
                  <svg className="w-8 h-8 text-gray-300 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m0 0l7-7" />
                  </svg>
                </div>
              </a>

              {/* Step 2: Frontend */}
              <a 
                href="https://docs.base.org/base-account/improve-ux/spend-permissions?utm_source=x&utm_medium=video&utm_campaign=spend-permissions-youssef" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center mb-8 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer group"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:bg-purple-600 transition-colors">
                    💻
                  </div>
                </div>
                <div className="ml-6 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600">Frontend</h3>
                  <p className="text-gray-600">Prepares spend permission calls and sends to backend</p>
                </div>
                <div className="hidden md:block">
                  <svg className="w-8 h-8 text-gray-300 group-hover:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m0 0l7-7" />
                  </svg>
                </div>
              </a>

              {/* Step 3: AI Agent */}
              <a 
                href="https://chatgpt.com?utm_source=x&utm_medium=video&utm_campaign=spend-permissions-youssef" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center mb-8 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer group"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:bg-green-600 transition-colors">
                    🤖
                  </div>
                </div>
                <div className="ml-6 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600">AI Agent (GPT-5-Nano)</h3>
                  <p className="text-gray-600">Processes natural language requests and decides to buy creator coins</p>
                </div>
                <div className="hidden md:block">
                  <svg className="w-8 h-8 text-gray-300 group-hover:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m0 0l7-7" />
                  </svg>
                </div>
              </a>

              {/* Step 4: Server Wallet */}
              <a 
                href="https://docs.cdp.coinbase.com/server-wallets/v2/introduction/welcome?utm_source=x&utm_medium=video&utm_campaign=spend-permissions-youssef" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center mb-8 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer group"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:bg-orange-600 transition-colors">
                    🏦
                  </div>
                </div>
                <div className="ml-6 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600">Server Wallet (CDP Smart Account)</h3>
                  <p className="text-gray-600">Executes spend calls, swaps USDC for creator coins, transfers to user</p>
                </div>
                <div className="hidden md:block">
                  <svg className="w-8 h-8 text-gray-300 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m0 0l7-7" />
                  </svg>
                </div>
              </a>

              {/* Step 5: Zora Protocol */}
              <a 
                href="https://docs.zora.co/coins/sdk?utm_source=x&utm_medium=video&utm_campaign=spend-permissions-youssef" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center mb-8 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer group"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:bg-purple-700 transition-colors">
                    🎨
                  </div>
                </div>
                <div className="ml-6 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600">Zora Protocol</h3>
                  <p className="text-gray-600">Creator coin lookup and trading via Zora's decentralized protocol</p>
                </div>
                <div className="hidden md:block">
                  <svg className="w-8 h-8 text-gray-300 group-hover:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m0 0l7-7" />
                  </svg>
                </div>
              </a>

              {/* Step 6: Base Chain */}
              <a 
                href="https://docs.base.org/base-chain/quickstart/why-base?utm_source=x&utm_medium=video&utm_campaign=spend-permissions-youssef" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer group"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:bg-blue-700 transition-colors">
                    ⛓️
                  </div>
                </div>
                <div className="ml-6 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">Base Chain</h3>
                  <p className="text-gray-600">Transactions execute on-chain with gas sponsorship</p>
                </div>
              </a>
            </div>

            {/* Key Components */}
            <div className="mt-12 grid md:grid-cols-2 gap-6">
              <a 
                href="https://docs.base.org/base-account/improve-ux/spend-permissions?utm_source=x&utm_medium=video&utm_campaign=spend-permissions-youssef" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-slate-50 rounded-lg p-6 hover:bg-slate-100 transition-colors duration-200 cursor-pointer group"
              >
                <h4 className="font-semibold text-gray-900 mb-3 group-hover:text-blue-600">
                  🔐 Spend Permissions
                </h4>
                <p className="text-sm text-gray-600">
                  User grants limited spending authority to server wallet's smart account. 
                  Server can only spend up to the permitted amount.
                </p>
              </a>
              <a 
                href="https://docs.base.org/base-account/improve-ux/sponsor-gas/paymasters?utm_source=x&utm_medium=video&utm_campaign=spend-permissions-youssef" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-slate-50 rounded-lg p-6 hover:bg-slate-100 transition-colors duration-200 cursor-pointer group"
              >
                <h4 className="font-semibold text-gray-900 mb-3 group-hover:text-blue-600">
                  ⛽ Gas Sponsorship
                </h4>
                <p className="text-sm text-gray-600">
                  All transactions are sponsored using CDP's paymaster. 
                  Users don't need ETH for gas fees.
                </p>
              </a>
            </div>
          </div>
          </div>
        )}
      </div>
    </main>
  )
}