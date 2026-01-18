'use client';

import { useState } from 'react';
import { ClientWrapper } from '@/components/ClientWrapper';
import { minikitConfig } from '@/minikit.config';

export default function Home() {
  const [greeting, setGreeting] = useState('');
  const [hasGreeted, setHasGreeted] = useState(false);

  const handleGreet = () => {
    const greetings = [
      'Hello, Base!',
      'Welcome to mini apps!',
      'Glad you are here!',
      'Building onchain!',
      'Based and pilled!',
    ];
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    setGreeting(randomGreeting);
    setHasGreeted(true);
  };

  return (
    <ClientWrapper
      appName={minikitConfig.miniapp.name}
      appDescription={minikitConfig.miniapp.description}
    >
      <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-md w-full text-center">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-4xl">👋</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {minikitConfig.miniapp.name}
          </h1>
          <p className="text-gray-600 mb-8">
            {minikitConfig.miniapp.subtitle}
          </p>

          {/* Greeting Display */}
          {hasGreeted && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 animate-fade-in">
              <p className="text-xl font-medium text-blue-600">
                {greeting}
              </p>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleGreet}
            className="w-full py-4 px-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors shadow-sm active:scale-98"
          >
            {hasGreeted ? 'Say Hello Again' : 'Say Hello'}
          </button>

          {/* Info */}
          <p className="mt-8 text-sm text-gray-500">
            This is a demo mini app built with the MiniApp Pipeline.
          </p>
        </div>
      </main>
    </ClientWrapper>
  );
}
