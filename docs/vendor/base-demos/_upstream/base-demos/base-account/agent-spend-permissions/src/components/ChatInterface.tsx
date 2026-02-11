'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  toolCall?: boolean;
  details?: any;
}

interface ChatInterfaceProps {
  isAuthenticated: boolean;
  userAddress?: string;
}

export function ChatInterface({
  isAuthenticated,
  userAddress,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content:
        "Hello! I'm your Zora coin buying agent. I can help you purchase creator coins using your spend permissions. Just tell me which Zora user's coins you'd like to buy and how much you want to spend!",
      sender: 'agent',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading || !isAuthenticated) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Prepare messages for API
      const chatMessages = messages
        .concat([userMessage])
        .filter((m) => m.sender === 'user' || m.sender === 'agent')
        .map((m) => ({
          role:
            m.sender === 'user' ? ('user' as const) : ('assistant' as const),
          content: m.content,
        }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: chatMessages }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // If this is a tool call (buy_zora_coin), we need to handle spend permissions on the frontend
      if (data.toolCall && data.details?.function?.name === 'buy_zora_coin') {
        await handleZoraCoinPurchase(data.details.function.arguments);
        return;
      }

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        sender: 'agent',
        timestamp: new Date(),
        toolCall: data.toolCall,
        details: data.details,
      };

      setMessages((prev) => [...prev, agentMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        sender: 'agent',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleZoraCoinPurchase = async (args: any) => {
    try {
      // Parse the function arguments
      const { zoraHandle, amountUSD } =
        typeof args === 'string' ? JSON.parse(args) : args;

      // Get stored spend permission
      const storedPermission = localStorage.getItem('spendPermission');
      console.log('Stored permission:', storedPermission);
      if (!storedPermission) {
        throw new Error(
          'No spend permission found. Please set up spend permissions first.'
        );
      }

      const permission = JSON.parse(storedPermission);

      // Import spend permission utilities dynamically (client-side only)
      const { getPermissionStatus, prepareSpendCallData } =
        await import('@base-org/account/spend-permission');

      // Check permission status
      const status = await getPermissionStatus(permission);
      const requiredAmountUSDC = BigInt(Math.floor(amountUSD * 1_000_000));

      if (status.remainingSpend < requiredAmountUSDC) {
        throw new Error(
          `Insufficient spend permission. Remaining: $${Number(status.remainingSpend) / 1_000_000}`
        );
      }

      // Prepare spend calls on the frontend
      const spendCalls = await prepareSpendCallData(
        permission,
        requiredAmountUSDC
      );

      // Call the backend API to execute the purchase with prepared calls
      const buyResponse = await fetch('/api/zora/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          zoraHandle,
          amountUSD,
          spendCalls,
        }),
      });

      const buyResult = await buyResponse.json();

      const resultMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: buyResult.success
          ? buyResult.message
          : `Failed to purchase: ${buyResult.error}`,
        sender: 'agent',
        timestamp: new Date(),
        toolCall: true,
        details: buyResult,
      };

      setMessages((prev) => [...prev, resultMessage]);

      // Auto-redirect to Base Account activity page after successful purchase
      if (buyResult.success && buyResult.redirect) {
        setTimeout(() => {
          window.open(buyResult.redirect.url, '_blank');
        }, 2000);
      }
    } catch (error) {
      console.error('Zora coin purchase error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Failed to purchase Zora coin: ${error instanceof Error ? error.message : 'Unknown error'}`,
        sender: 'agent',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Please sign in with Base to start chatting with the agent.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <div className="border-b border-slate-200 p-4 bg-white/80 backdrop-blur-sm">
        <h2 className="text-xl font-semibold text-slate-900">
          Zora Coin Agent
        </h2>
        <p className="text-sm text-slate-600">
          Connected: {userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                message.sender === 'user'
                  ? 'bg-base-blue shadow-blue-100'
                  : 'bg-white border border-slate-200 shadow-slate-100'
              }`}
            >
              <p
                className={`text-sm whitespace-pre-wrap leading-relaxed ${
                  message.sender === 'user' ? 'text-white' : 'text-slate-900'
                }`}
              >
                {message.content}
              </p>
              {message.toolCall &&
                message.details &&
                message.details.success && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                    <p className="font-medium text-green-800 mb-2">
                      🎉 Creator coin purchase completed!
                    </p>
                    <a
                      href="https://account.base.app/activity"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-2 bg-base-blue text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                    >
                      View Activity →
                    </a>
                    <p className="text-green-700 text-xs mt-2">
                      Check your transaction activity to see the creator coin in
                      your wallet
                    </p>
                  </div>
                )}
              <p
                className={`text-xs mt-2 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-slate-500'
                }`}
              >
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 shadow-slate-100 max-w-xs lg:max-w-md px-4 py-3 rounded-2xl">
              <div className="flex items-center space-x-2">
                <div className="animate-pulse flex space-x-1">
                  <div className="w-2 h-2 bg-base-blue rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-base-blue rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-base-blue rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                </div>
                <span className="text-sm text-slate-900">
                  Agent is thinking...
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 p-4 bg-white/80 backdrop-blur-sm">
        <div className="flex space-x-3">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me to buy a Zora coin... e.g., 'Buy $10 worth of @username's coin'"
            className="flex-1 p-3 border border-slate-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-base-blue focus:border-transparent bg-white shadow-sm transition-all duration-200 text-slate-900 placeholder-slate-500"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="px-6 py-3 bg-base-blue text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-base-blue focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <span className="font-medium">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
