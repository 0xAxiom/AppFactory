import { useAccount, useSwitchChain } from 'wagmi';
import { useState } from 'react';
import { base } from 'viem/chains';
import { encodeFunctionData } from 'viem';
import { useSendCalls } from 'wagmi/experimental';
import { GUESS_GAME_SCORING_ADDRESS, PAYMASTER_URL } from '../utils/constants';
import { GuessGameScoringABI } from '../utils/abis/GuessGameScoringABI';

interface SaveScoreButtonProps {
  score: number;
  onSuccess?: () => void;
}

export function SaveScoreButton({ score, onSuccess }: SaveScoreButtonProps) {
  const account = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { switchChain } = useSwitchChain();
  const { sendCalls } = useSendCalls({
    mutation: {
      onSuccess: () => {
        setSuccess(true);
        onSuccess?.();
      },
      onError: (error) => {
        console.error('Error saving score:', error);
        setError('Failed to save score. Please try again.');
      },
    },
  });

  const handleSaveScore = async () => {
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
        abi: GuessGameScoringABI,
        functionName: 'submitScore',
        args: [BigInt(score)],
      });

      console.log('Contract call data:', {
        to: GUESS_GAME_SCORING_ADDRESS,
        data,
        score: BigInt(score),
      });

      await sendCalls({
        calls: [
          {
            to: GUESS_GAME_SCORING_ADDRESS as `0x${string}`,
            data,
          },
        ],
        capabilities: {
          paymasterService: {
            url: PAYMASTER_URL,
          },
        },
      });
    } catch (err) {
      console.error('Error saving score:', err);
      setError('Failed to save score. Please try again.');
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
          <p className='text-green-500'>Score saved successfully! 🏆</p>
        </div>
      )}
      <button
        onClick={handleSaveScore}
        disabled={isLoading || !account.isConnected || score <= 0}
        className='w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed'
      >
        {isLoading ? (
          <div className='flex items-center justify-center'>
            <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
            Saving Score...
          </div>
        ) : !account.isConnected ? (
          'Connect Wallet'
        ) : (
          'Save Score'
        )}
      </button>
    </div>
  );
}
