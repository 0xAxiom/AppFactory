"use client";

import { useState, useCallback } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { Button } from "~/components/ui/button";

interface ComposeCastResult {
  cast: {
    hash: string;
    channelKey?: string;
  } | null;
}

interface ComposeCastParams {
  text?: string;
  embeds?: [] | [string] | [string, string];
  channelKey?: string;
  close?: boolean;
  parent?: { type: 'cast'; hash: string };
}

export function ComposeCastAction() {
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ComposeCastResult | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  
  // Form state
  const [text, setText] = useState<string>("I just learned how to compose a cast");
  const [embed1, setEmbed1] = useState<string>("https://miniapps.farcaster.xyz/docs/sdk/actions/compose-cast");
  const [embed2, setEmbed2] = useState<string>("");
  const [channelKey, setChannelKey] = useState<string>("");
  const [close, setClose] = useState<boolean>(false);
  const [parentHash, setParentHash] = useState<string>("");

  const composeCast = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(undefined);
      setResult(undefined);
      
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
      const params: ComposeCastParams = {};
      if (text.trim()) params.text = text.trim();
      if (embeds) params.embeds = embeds;
      if (channelKey.trim()) params.channelKey = channelKey.trim();
      if (close) params.close = close;
      if (parentHash.trim()) {
        params.parent = { type: 'cast', hash: parentHash.trim() };
      }

      const castResult = await sdk.actions.composeCast(params);
      setResult(castResult);
    } catch (err) {
      console.error("Compose cast error:", err);
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, [text, embed1, embed2, channelKey, close, parentHash]);

  return (
    <div className="mb-4">
      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
        <pre className="font-mono text-xs text-emerald-500 dark:text-emerald-400">sdk.actions.composeCast</pre>
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
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="close-app"
            checked={close}
            onChange={(e) => setClose(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="close-app" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Close app after composing
          </label>
        </div>
      </div>
      
      <Button onClick={composeCast} disabled={loading}>
        Compose Cast
      </Button>
      
      {error && !loading && (
        <div className="my-2 p-2 text-xs overflow-x-scroll bg-gray-100 dark:bg-gray-800 rounded-lg font-mono">
          <div className="font-semibold text-gray-500 dark:text-gray-400 mb-1">Error</div>
          <div className="whitespace-pre text-red-500 dark:text-red-400">{error}</div>
        </div>
      )}
      {result !== undefined && !loading && (
        <div className="my-2">
          <div className="p-2 text-xs overflow-x-scroll bg-gray-100 dark:bg-gray-800 rounded-lg font-mono">
            <div className="font-semibold text-gray-500 dark:text-gray-400 mb-1">Compose Cast Result</div>
            <div className="whitespace-pre text-emerald-500 dark:text-emerald-400">{JSON.stringify(result, null, 2)}</div>
          </div>
        </div>
      )}
    </div>
  );
} 