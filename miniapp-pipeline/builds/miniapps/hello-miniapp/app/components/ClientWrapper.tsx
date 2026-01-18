'use client';

import { useEffect, useState, ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { LoadingState } from './LoadingState';

interface Props {
  children: ReactNode;
  appName: string;
  appDescription?: string;
}

type ClientState = 'loading' | 'client' | 'browser';

export function ClientWrapper({ children, appName, appDescription }: Props) {
  const [clientState, setClientState] = useState<ClientState>('loading');

  useEffect(() => {
    const detectClient = () => {
      const inFrame = window.parent !== window;
      const userAgent = navigator.userAgent;
      const isFarcasterClient =
        userAgent.includes('Farcaster') ||
        userAgent.includes('Warpcast');

      if (inFrame || isFarcasterClient) {
        setClientState('client');
      } else {
        setClientState('browser');
      }
    };

    const timer = setTimeout(detectClient, 100);
    return () => clearTimeout(timer);
  }, []);

  if (clientState === 'loading') {
    return <LoadingState message="Loading..." />;
  }

  if (clientState === 'browser') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-gray-50">
        <div className="max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-xl flex items-center justify-center">
            <span className="text-2xl">👋</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">{appName}</h1>
          {appDescription && (
            <p className="text-gray-600 mb-6">{appDescription}</p>
          )}
          <p className="text-sm text-gray-500 mb-8">
            This mini app is designed to run inside the Base app.
          </p>
          <a
            href="https://base.org/app"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Base App
          </a>
        </div>
      </div>
    );
  }

  return <ErrorBoundary>{children}</ErrorBoundary>;
}
