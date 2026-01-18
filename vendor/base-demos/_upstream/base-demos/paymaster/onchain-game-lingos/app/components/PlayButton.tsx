import { useAccount, useSwitchChain } from 'wagmi';
import { useState } from 'react';
import { GuessGameABI } from '../utils/abis/GuessGameABI';
import { base } from 'viem/chains';
import { parseEther } from 'viem';
import { encodeFunctionData } from 'viem';
import { useSendCalls } from 'wagmi/experimental';
import {
  GUESS_GAME_ADDRESS,
  PAYMASTER_URL,
  PLAY_FEE,
} from '../utils/constants';

interface PlayButtonProps {
  onSuccess: () => void;
  finalScore?: number;
}

export function PlayButton({ onSuccess, finalScore }: PlayButtonProps) {
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
      },
      onError: (error) => {
        console.error('Error starting game:', error);
        setError('Failed to start game. Please try again.');
      },
    },
  });

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

    try {
      const data = encodeFunctionData({
        abi: GuessGameABI,
        functionName: 'startGame',
      });

      await sendCalls({
        calls: [
          {
            to: GUESS_GAME_ADDRESS,
            data,
            value: parseEther(PLAY_FEE),
          },
        ],
        capabilities: {
          paymasterService: {
            url: PAYMASTER_URL,
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
