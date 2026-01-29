'use client';

import { minikitConfig } from '../minikit.config';

/**
 * Mini App Header
 *
 * A compact header suitable for the mini app context.
 * In the Base app, the system provides navigation controls,
 * so this header is minimal.
 */

export function MiniAppHeader() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-black/50 border-b border-white/10">
      <div className="flex items-center justify-center h-12 px-4">
        <span className="font-semibold text-sm">{minikitConfig.miniapp.name}</span>
      </div>
    </header>
  );
}
