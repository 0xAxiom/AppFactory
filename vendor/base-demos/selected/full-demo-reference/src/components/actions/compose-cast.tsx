"use client";

import { useState, useCallback } from "react";
import { Button } from "~/components/ui/Button";
import { useComposeCast } from "@coinbase/onchainkit/minikit";

export function ComposeCastAction() {
  // Use MiniKit's useComposeCast hook (React Query powered)
  const { composeCast, isPending, error, data } = useComposeCast();
  
  // Form state
  const [text, setText] = useState<string>("I just learned how to compose a cast");
  const [embed1, setEmbed1] = useState<string>("https://miniapps.farcaster.xyz/docs/sdk/actions/compose-cast");
  const [embed2, setEmbed2] = useState<string>("");
  const [channelKey, setChannelKey] = useState<string>("");
  const [close, setClose] = useState<boolean>(false);
  const [parentHash, setParentHash] = useState<string>("");

  const handleComposeCast = useCallback((): void => {
    // Build embeds array - SDK expects [] | [string] | [string, string]
    let embeds: [] | [string] | [string, string] | undefined;
    const embed1Trimmed = embed1.trim();
    const embed2Trimmed = embed2.trim();
    
    if (embed1Trimmed && embed2Trimmed) {
      embeds = [embed1Trimmed, embed2Trimmed];
    } else if (embed1Trimmed) {
      embeds = [embed1Trimmed];
    } else if (embed2Trimmed) {
      embeds = [embed2Trimmed];
    } else {
      embeds = undefined;
    }
    
    // Build parameters object
    const params = {
      ...(text.trim() && { text: text.trim() }),
      ...(embeds && { embeds }),
      ...(channelKey.trim() && { channelKey: channelKey.trim() }),
      ...(parentHash.trim() && { parent: { type: 'cast' as const, hash: parentHash.trim() } })
    };
    
    // Note: MiniKit's current type system doesn't support close: true properly in this hook
    // The close functionality would need to be handled at the app level
    composeCast(params);
  }, [composeCast, text, embed1, embed2, channelKey, parentHash]);

  return (
    <div className="mb-4">
      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
        <pre className="font-mono text-xs text-emerald-500 dark:text-emerald-400">useComposeCast()</pre>
      </div>
      
      {/* Form Fields */}
      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Cast Text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
            placeholder="Enter cast text (supports @mentions)"
            disabled={isPending}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Embed 1 (URL)
          </label>
          <input
            type="url"
            value={embed1}
            onChange={(e) => setEmbed1(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com"
            disabled={isPending}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Embed 2 (URL) - Optional
          </label>
          <input
            type="url"
            value={embed2}
            onChange={(e) => setEmbed2(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com (optional second embed)"
            disabled={isPending}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Channel Key - Optional
          </label>
          <input
            type="text"
            value={channelKey}
            onChange={(e) => setChannelKey(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g. farcaster, warpcast"
            disabled={isPending}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Parent Cast Hash - Optional
          </label>
          <input
            type="text"
            value={parentHash}
            onChange={(e) => setParentHash(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Cast hash to reply to"
            disabled={isPending}
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="close-app"
            checked={close}
            onChange={(e) => setClose(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            disabled={isPending}
          />
          <label htmlFor="close-app" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Close app after composing
          </label>
        </div>
      </div>
      
      <Button 
        onClick={handleComposeCast}
        disabled={isPending}
        isLoading={isPending}
      >
        {isPending ? "Processing..." : "Compose Cast"}
      </Button>
      
      {error && (
        <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg my-2 text-xs text-red-600 dark:text-red-400">
          Error: {error.message}
        </div>
      )}
      
      {data && (
        <div className="p-2 bg-muted border border-border rounded-lg my-2">
          <div className="font-mono text-xs text-primary">Cast composed successfully!</div>
          <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
            {JSON.stringify(data, null, 2)}
          </div>
        </div>
      )}
    </div>
  );
} 