import { createPublicClient, http } from 'viem';
import { useAccount } from 'wagmi';
import { base } from 'viem/chains';
import { GuessGameABI } from './abis/GuessGameABI';
import { useWriteContracts, useCapabilities } from 'wagmi/experimental';
import { useMemo } from 'react';

const GUESS_GAME_ADDRESS =
  '0x8ADfC09B165e398e45999C7bD045db66c5597e00' as `0x${string}`;

const paymasterUrl = process.env.NEXT_PUBLIC_PAYMASTER_PROXY_SERVER_URL;

export const publicClient = createPublicClient({
  chain: base,
  transport: http(
    'https://api.developer.coinbase.com/rpc/v1/base/T9KETHTnqXrlrgt5fOVfmjgR3S4Bf3j9'
  ),
});

export const guessGameContract = {
  address: GUESS_GAME_ADDRESS,
  abi: GuessGameABI,
};

export function useGameContract() {
  const account = useAccount();

  const { writeContracts } = useWriteContracts({});
  const { data: availableCapabilities } = useCapabilities({
    account: account.address,
  });

  const capabilities = useMemo(() => {
    if (!availableCapabilities || !account.chainId) return {};
    const capabilitiesForChain = availableCapabilities[account.chainId];
    if (
      capabilitiesForChain['PaymasterService'] &&
      capabilitiesForChain['PaymasterService'].supported
    ) {
      return {
        PaymasterService: {
          url: paymasterUrl,
        },
      };
    }
    return {};
  }, [availableCapabilities, account.chainId]);

  const startGame = async () => {
    try {
      const result = await writeContracts({
        contracts: [
          {
            address: GUESS_GAME_ADDRESS,
            abi: GuessGameABI,
            functionName: 'startGame',
          },
        ],
        capabilities,
      });

      return result;
    } catch (error) {
      console.error('Error starting game:', error);
      throw error;
    }
  };

  return {
    startGame,
    isConnected: account.isConnected,
    address: account.address,
  };
}
