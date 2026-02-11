'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

interface Word {
  word: string;
  description: string;
  hints: string[];
}

interface Category {
  name: string;
  words: Word[];
}

interface Categories {
  categories: Category[];
}

export default function GameScreen({
  params,
}: {
  params: { category: string };
}) {
  const router = useRouter();
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>(
    'playing'
  );
  const [availableHints, setAvailableHints] = useState(0);
  const [loading, setLoading] = useState(true);
  const account = useAccount();
  const [winApiStatus, setWinApiStatus] = useState<
    'idle' | 'pending' | 'success' | 'error'
  >('idle');
  const [winApiError, setWinApiError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const MAX_WRONG_GUESSES = 3;

  useEffect(() => {
    const loadCategory = async () => {
      try {
        const response = await fetch('/wordCategories.json');
        const data: Categories = await response.json();
        const category = data.categories.find(
          (cat) => cat.name === decodeURIComponent(params.category)
        );

        if (category) {
          // Randomly select a word from the category
          const randomIndex = Math.floor(Math.random() * category.words.length);
          setCurrentWord(category.words[randomIndex]);
        }
      } catch (error) {
        console.error('Error loading category:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [params.category]);

  useEffect(() => {
    if (gameStatus === 'won' && account.address) {
      setWinApiStatus('pending');
      fetch('/api/win', {
        method: 'POST',
        body: JSON.stringify({
          playerAddress: account.address,
          score: 100, // Replace with actual score if available
          gameId: params.category,
        }),
        headers: { 'Content-Type': 'application/json' },
      })
        .then(async (res) => {
          if (!res.ok) throw new Error(await res.text());
          const data = await res.json();
          setWinApiStatus('success');
          setTxHash(data.transactionHash);
          console.log('Game win tx hash:', data.transactionHash);
        })
        .catch((err) => {
          setWinApiStatus('error');
          setWinApiError(err.message);
        });
    }
  }, [gameStatus, account.address, params.category]);

  const handleLetterGuess = (letter: string) => {
    if (gameStatus !== 'playing' || guessedLetters.includes(letter)) return;

    const newGuessedLetters = [...guessedLetters, letter];
    setGuessedLetters(newGuessedLetters);

    if (!currentWord?.word.includes(letter)) {
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);

      if (newWrongGuesses >= MAX_WRONG_GUESSES) {
        setGameStatus('lost');
      }
    } else {
      // Check if all letters have been guessed
      const allLettersGuessed = currentWord.word
        .split('')
        .every((letter) => newGuessedLetters.includes(letter));

      if (allLettersGuessed) {
        setGameStatus('won');
      }
    }
  };

  const handleHintRequest = () => {
    if (currentWord && availableHints < currentWord.hints.length) {
      setAvailableHints((prev) => prev + 1);
    }
  };

  const getDisplayWord = () => {
    if (!currentWord) return '';
    return currentWord.word
      .split('')
      .map((letter) => (guessedLetters.includes(letter) ? letter : '_'))
      .join(' ');
  };

  const getHangmanState = () => {
    // Return the appropriate hangman SVG based on wrong guesses
    return `Hangman state: ${wrongGuesses}/${MAX_WRONG_GUESSES}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!currentWord) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Category not found</h1>
        <button
          onClick={() => router.push('/category-select')}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Back to Categories
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {/* Game Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Category: {decodeURIComponent(params.category)}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {currentWord.description}
          </p>
        </div>

        {/* Game Status */}
        <div className="text-center mb-8">
          <div className="text-2xl font-mono mb-4">{getDisplayWord()}</div>
          <div className="text-gray-600 dark:text-gray-300 mb-4">
            {getHangmanState()}
          </div>
          {gameStatus !== 'playing' && (
            <div className="text-xl font-bold mb-4">
              {gameStatus === 'won' ? '🎉 You Won!' : '😢 Game Over!'}
            </div>
          )}
          {gameStatus === 'won' && winApiStatus === 'pending' && (
            <div className="text-blue-500">Recording your win onchain...</div>
          )}
          {gameStatus === 'won' && winApiStatus === 'success' && (
            <div className="text-green-500">
              Win recorded onchain! 🪙
              <br />
              {txHash && (
                <>
                  Tx Hash:{' '}
                  <a
                    href={`https://basescan.org/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {txHash}
                  </a>
                </>
              )}
            </div>
          )}
          {gameStatus === 'won' && winApiStatus === 'error' && (
            <div className="text-red-500">
              Error recording win: {winApiError}
            </div>
          )}
        </div>

        {/* Hints Section */}
        <div className="mb-8 text-center">
          <button
            onClick={handleHintRequest}
            disabled={
              availableHints >= currentWord.hints.length ||
              gameStatus !== 'playing'
            }
            className={`px-4 py-2 rounded-lg transition-colors ${
              availableHints >= currentWord.hints.length ||
              gameStatus !== 'playing'
                ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {availableHints >= currentWord.hints.length
              ? 'No More Hints'
              : `Get Hint (${availableHints + 1}/${currentWord.hints.length})`}
          </button>
          {availableHints > 0 && (
            <div className="mt-4 space-y-2">
              {currentWord.hints.slice(0, availableHints).map((hint, index) => (
                <p
                  key={index}
                  className="text-gray-600 dark:text-gray-300 animate-fade-in"
                >
                  Hint {index + 1}: {hint}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Letter Grid */}
        <div className="grid grid-cols-7 gap-2 mb-8">
          {Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map((letter) => (
            <button
              key={letter}
              onClick={() => handleLetterGuess(letter)}
              disabled={
                guessedLetters.includes(letter) || gameStatus !== 'playing'
              }
              className={`p-2 text-center rounded-lg transition-colors ${
                guessedLetters.includes(letter)
                  ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                  : currentWord.word.includes(letter)
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>

        {/* Game Controls */}
        <div className="flex justify-center space-x-4">
          {gameStatus !== 'playing' && (
            <button
              onClick={() => router.push('/category-select')}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Play Again
            </button>
          )}
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
