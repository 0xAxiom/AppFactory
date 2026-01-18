'use client';

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
import { PlayButton } from './components/PlayButton';

export default function App() {
  return (
    <div className='flex flex-col min-h-screen font-sans dark:bg-background dark:text-white bg-white text-black'>
      <header className='pt-4 pr-4'>
        <div className='flex justify-end'>
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
      </header>

      <main className='flex-grow flex items-center justify-center'>
        <div className='max-w-4xl w-full p-4'>
          {/* Game Title */}
          <div className='text-center mb-8'>
            <h1 className='text-6xl font-bold mb-4'>Hangman Onchain</h1>
            <p className='text-xl text-gray-600 dark:text-gray-300'>
              Play the classic word game and earn rewards on the blockchain!
            </p>
          </div>

          {/* Game Features */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
            <div className='p-6 rounded-lg bg-gray-100 dark:bg-gray-800 text-center'>
              <h3 className='text-xl font-semibold mb-2'>🎮 Play</h3>
              <p className='text-gray-600 dark:text-gray-300'>
                Guess words across different categories
              </p>
            </div>
            <div className='p-6 rounded-lg bg-gray-100 dark:bg-gray-800 text-center'>
              <h3 className='text-xl font-semibold mb-2'>💰 Earn</h3>
              <p className='text-gray-600 dark:text-gray-300'>
                Win rewards for your word-guessing skills
              </p>
            </div>
            <div className='p-6 rounded-lg bg-gray-100 dark:bg-gray-800 text-center'>
              <h3 className='text-xl font-semibold mb-2'>🏆 Compete</h3>
              <p className='text-gray-600 dark:text-gray-300'>
                Climb the leaderboard and show your mastery
              </p>
            </div>
          </div>

          {/* Start Game Buttons */}
          <div className='flex justify-center mb-8'>
            <div className='w-full max-w-md'>
              <PlayButton onSuccess={() => {}} />
            </div>
          </div>

          {/* How to Play */}
          <div className='mt-16 p-6 rounded-lg bg-gray-100 dark:bg-gray-800'>
            <h2 className='text-2xl font-bold mb-4 text-center'>How to Play</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <h3 className='text-lg font-semibold mb-2'>
                  1. Choose a Category
                </h3>
                <p className='text-gray-600 dark:text-gray-300'>
                  Select from various word categories like Animals, Countries,
                  or Foods
                </p>
              </div>
              <div>
                <h3 className='text-lg font-semibold mb-2'>2. Guess Letters</h3>
                <p className='text-gray-600 dark:text-gray-300'>
                  Try to guess the hidden word by selecting letters
                </p>
              </div>
              <div>
                <h3 className='text-lg font-semibold mb-2'>3. Win Rewards</h3>
                <p className='text-gray-600 dark:text-gray-300'>
                  Successfully guess the word to earn onchain rewards
                </p>
              </div>
              <div>
                <h3 className='text-lg font-semibold mb-2'>4. Use Hints</h3>
                <p className='text-gray-600 dark:text-gray-300'>
                  Get help with hints when you&apos;re stuck
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
