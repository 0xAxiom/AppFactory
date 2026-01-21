'use client';

import { Sparkles, ExternalLink } from 'lucide-react';
import { MiniAppHeader } from '@/components/MiniAppHeader';
import { minikitConfig } from '../minikit.config';

/**
 * Home Page
 *
 * Main page of the mini app. Designed for mobile-first experience
 * within the Base app context.
 */

export default function Home() {
  const isAccountAssociationComplete =
    minikitConfig.accountAssociation.header &&
    minikitConfig.accountAssociation.payload &&
    minikitConfig.accountAssociation.signature;

  return (
    <main className="min-h-screen flex flex-col">
      <MiniAppHeader />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        {/* Icon */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6">
          <Sparkles className="w-10 h-10 text-white" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-2">
          {minikitConfig.name}
        </h1>
        <p className="text-gray-400 text-center mb-8 max-w-xs">
          {minikitConfig.tagline}
        </p>

        {/* Status */}
        <div className="w-full max-w-sm space-y-4">
          {/* Account Association Status */}
          <div
            className={`p-4 rounded-xl border ${
              isAccountAssociationComplete
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-yellow-500/10 border-yellow-500/30'
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-3 h-3 rounded-full ${
                  isAccountAssociationComplete
                    ? 'bg-green-500'
                    : 'bg-yellow-500'
                }`}
              />
              <div>
                <p className="font-medium">
                  {isAccountAssociationComplete
                    ? 'Account Associated'
                    : 'Account Association Required'}
                </p>
                {!isAccountAssociationComplete && (
                  <p className="text-sm text-gray-400">
                    Complete at base.dev before deploying
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <h2 className="font-medium mb-2">This is an example mini app</h2>
            <p className="text-sm text-gray-400 mb-4">
              Built with the MiniApp Pipeline from App Factory. Replace this
              content with your own app logic.
            </p>
            <a
              href="https://github.com/MeltedMindz/AppFactory"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300"
            >
              View App Factory
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 px-4 text-center text-gray-500 text-sm">
        <p>Built with App Factory</p>
      </footer>
    </main>
  );
}
