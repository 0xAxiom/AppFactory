'use client';

import { useState } from 'react';
import { Button } from './components/DemoComponents';
import { GameOverScreen } from './components/GameOverScreen';
import { FeedbackOverlay } from './components/FeedbackOverlay';
import { ScoreDisplay } from './components/ScoreDisplay';
import { HomeScreen } from './components/HomeScreen';
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

interface Lingo {
  id: number;
  category: string;
  language: string;
  description: string;
  level: string;
  prompt: string;
  answer: string;
  choices: string[];
}

type GameState = 'home' | 'playing' | 'gameOver';

export default function App() {
  const [currentLingo, setCurrentLingo] = useState<Lingo | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<GameState>('home');
  const [showFeedback, setShowFeedback] = useState<{
    isCorrect: boolean;
    message: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRandomLingo = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching new lingo...');
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/lingos?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          Pragma: 'no-cache',
          'Cache-Control': 'no-cache',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch lingo');
      }
      const data = await response.json();
      console.log('Received lingo:', {
        id: data.id,
        prompt: data.prompt,
        timestamp: new Date().toISOString(),
      });
      return data;
    } catch (error) {
      console.error('Error fetching lingo:', error);
      setError('Failed to load lingo. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const startGame = async () => {
    console.log('Starting new game...');
    setScore(0);
    setSelectedChoice(null);
    setShowFeedback(null);
    setError(null);
    setGameState('playing');
    const lingo = await getRandomLingo();
    if (lingo) {
      console.log('Setting initial lingo:', {
        id: lingo.id,
        prompt: lingo.prompt,
      });
      setCurrentLingo(lingo);
    } else {
      setGameState('home');
    }
  };

  const handleChoiceSelect = async (choice: string) => {
    if (!currentLingo) return;

    console.log('Choice selected:', {
      choice,
      correctAnswer: currentLingo.answer,
      lingoId: currentLingo.id,
    });

    const isCorrect = choice === currentLingo.answer;
    setSelectedChoice(choice);

    if (isCorrect) {
      console.log('Correct answer! Fetching next lingo...');
      setScore((prev) => prev + 1);
      setShowFeedback({ isCorrect: true, message: 'Correct! 🎉' });
      setTimeout(async () => {
        setShowFeedback(null);
        setSelectedChoice(null);
        const newLingo = await getRandomLingo();
        if (newLingo) {
          console.log('Setting next lingo:', {
            id: newLingo.id,
            prompt: newLingo.prompt,
          });
          setCurrentLingo(newLingo);
        } else {
          setGameState('home');
        }
      }, 1500);
    } else {
      console.log('Incorrect answer, game over');
      setShowFeedback({ isCorrect: false, message: 'Game Over! 😢' });
      setTimeout(() => {
        setGameState('gameOver');
      }, 1500);
    }
  };

  const handleRestart = () => {
    setGameState('home');
  };

  if (gameState === 'home') {
    return <HomeScreen onStartGame={startGame} finalScore={score} />;
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4'></div>
          <p className='text-lg'>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <p className='text-red-500 mb-4'>{error}</p>
          <button
            onClick={handleRestart}
            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!currentLingo) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <p className='text-red-500 mb-4'>No lingo available</p>
          <button
            onClick={handleRestart}
            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

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
          <h1
            className='text-6xl font-extrabold text-[var(--app-foreground)] tracking-tight cursor-pointer hover:opacity-80 transition-opacity'
            onClick={() => setGameState('home')}
          >
            Lingos
          </h1>
          <div className='h-1 w-24 bg-[var(--app-foreground)] mx-auto mt-4 rounded-full'></div>
        </div>

        <div className='text-center mb-8'>
          <ScoreDisplay score={score} />
        </div>

        <main className='flex-1'>
          <div className='bg-white rounded-lg p-6 shadow-sm mb-6'>
            <div className='mb-4'>
              <p className='text-sm text-gray-500'>
                {currentLingo.language} - {currentLingo.category}
              </p>
              <p className='text-lg font-bold italic text-black'>
                {currentLingo.prompt}
              </p>
              <p className='text-sm text-gray-600 mt-2'>
                {currentLingo.description}
              </p>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              {currentLingo.choices.map((choice, index) => (
                <Button
                  key={index}
                  variant={selectedChoice === choice ? 'primary' : 'secondary'}
                  size='lg'
                  onClick={() => handleChoiceSelect(choice)}
                  className='w-full'
                  disabled={selectedChoice !== null}
                >
                  {choice}
                </Button>
              ))}
            </div>
          </div>
        </main>

        {showFeedback && (
          <FeedbackOverlay
            isCorrect={showFeedback.isCorrect}
            message={showFeedback.message}
          />
        )}

        {gameState === 'gameOver' && (
          <GameOverScreen score={score} onRestart={handleRestart} />
        )}
      </div>
    </div>
  );
}
