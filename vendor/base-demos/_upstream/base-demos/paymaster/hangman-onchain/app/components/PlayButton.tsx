'use client';

import { useAccount, useSwitchChain, createConfig, http } from 'wagmi';
import { useState } from 'react';
import { AirdropABI } from '../utils/abis/AirdropABI';
import { base } from 'viem/chains';
import { parseEther } from 'viem';
import { encodeFunctionData } from 'viem';
import { useSendCalls } from 'wagmi/experimental';
import { useRouter } from 'next/navigation';
import {
  GAME_CONTRACT_ADDRESS,
  PAYMASTER_URL,
  PLAY_FEE_ETH,
} from '../utils/constants';

interface PlayButtonProps {
  onSuccess: () => void;
  finalScore?: number;
}

export const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(PAYMASTER_URL),
  },
});

export function PlayButton({ onSuccess, finalScore }: PlayButtonProps) {
  const router = useRouter();
  const account = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { switchChain } = useSwitchChain();
  const { sendCalls } = useSendCalls({
    mutation: {
      onSuccess: () => {
        setSuccess(true);
        onSuccess();
        router.push('/category-select');
      },
      onError: (error) => {
        console.error('Error starting game:', error);
        setError('Failed to start game. Please try again.');
      },
    },
  });

  // const capabilities = useCapabilities({ config });

  // console.log(capabilities);

  const handlePlay = async () => {
    if (!account.isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    if (!account.chainId) {
      setError('Please connect to Base network');
      return;
    }

    if (account.chainId !== base.id) {
      switchChain({ chainId: base.id });
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    console.log('PAYMASTER_URL', PAYMASTER_URL);
    try {
      const data = encodeFunctionData({
        abi: AirdropABI,
        functionName: 'startGame',
        args: [true],
      });

      const calls = [
        {
          to: GAME_CONTRACT_ADDRESS,
          data,
          value: parseEther(PLAY_FEE_ETH),
        },
      ];

      sendCalls({
        calls,
        capabilities: {
          paymasterService: {
            url: 'https://api.developer.coinbase.com/rpc/v1/base/2Ohgm8ABsCDs0AUApVoi5ivZGe2t7eHb',
          },
        },
      });
    } catch (err) {
      console.error('Error starting game:', err);
      setError('Failed to start game. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full'>
      {error && (
        <div className='mb-4'>
          <p className='text-red-500'>{error}</p>
        </div>
      )}
      {success && (
        <div className='mb-4'>
          <p className='text-green-500'>Game started successfully! 🎮</p>
        </div>
      )}
      <button
        onClick={handlePlay}
        disabled={isLoading || !account.isConnected}
        className='w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed'
      >
        {isLoading ? (
          <div className='flex items-center justify-center'>
            <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
            Starting Game...
          </div>
        ) : !account.isConnected ? (
          'Connect Wallet'
        ) : finalScore !== undefined ? (
          'Play Again'
        ) : (
          'Start Game'
        )}
      </button>
    </div>
  );
}
