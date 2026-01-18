import { PlayButton } from './PlayButton';
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from '@coinbase/onchainkit/identity';

interface HomeScreenProps {
  onStartGame: () => void;
  finalScore?: number;
}

export function HomeScreen({ onStartGame, finalScore }: HomeScreenProps) {
  return (
    <div className='flex flex-col min-h-screen font-sans text-[var(--app-foreground)] mini-app-theme from-[var(--app-background)] to-[var(--app-gray)]'>
      <div className='absolute right-4 top-4 z-10'>
        <div className='wallet-container'>
          <Wallet>
            <ConnectWallet>
              <Avatar className='h-6 w-6' />
              <Name />
            </ConnectWallet>
            <WalletDropdown>
              <Identity className='px-4 pt-3 pb-2' hasCopyAddressOnClick>
                <Avatar />
                <Name />
                <Address />
                <EthBalance />
              </Identity>
              <WalletDropdownLink
                icon='wallet'
                href='https://keys.coinbase.com'
                target='_blank'
                rel='noopener noreferrer'
              >
                Wallet
              </WalletDropdownLink>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        </div>
      </div>

      <div className='w-full max-w-md mx-auto px-4 py-3'>
        <div className='text-center mb-12'>
          <h1 className='text-6xl font-extrabold text-[var(--app-foreground)] tracking-tight'>
            Lingos
          </h1>
          <div className='h-1 w-24 bg-[var(--app-foreground)] mx-auto mt-4 rounded-full'></div>
        </div>

        <main className='flex-1 flex items-center justify-center'>
          <div className='bg-white rounded-lg p-8 max-w-md w-full text-center shadow-lg'>
            <p className='text-lg mb-8 text-gray-600'>
              Test your knowledge of phrases and proverbs from around the world!
            </p>

            {finalScore !== undefined && (
              <div className='mb-8'>
                <p className='text-xl font-semibold text-black'>
                  Your last score: {finalScore}
                </p>
              </div>
            )}

            <PlayButton onSuccess={onStartGame} finalScore={finalScore} />
          </div>
        </main>
      </div>
    </div>
  );
}
