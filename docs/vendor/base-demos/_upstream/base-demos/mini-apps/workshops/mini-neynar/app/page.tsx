"use client";

import { useMiniKit, useOpenUrl } from "@coinbase/onchainkit/minikit";

import { useEffect, useMemo, useState } from "react";
import ShoutoutCard from "./components/ShoutCard";
import ActionButtons from "./components/ActionButtons";
import UserHeader from "./components/UserHeader";
import { sdk } from "@farcaster/frame-sdk";

import { useFollowers } from "@/hooks/useFollowers";

// Base URL for the application
const BASE_URL = process.env.NEXT_PUBLIC_URL;

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();

  const { followers } = useFollowers(context?.user?.fid || 20390);

  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 4;

  const paginatedFollowers = useMemo(() => {
    if (!followers || followers.length === 0) return [];
    const startIndex = currentPage * pageSize;
    return followers.slice(startIndex, startIndex + pageSize);
  }, [followers, currentPage]);

  const hasMorePages = useMemo(() => {
    return followers && (currentPage + 1) * pageSize < followers.length;
  }, [followers, currentPage]);

  const openUrl = useOpenUrl();
  const username = useMemo(() => {
    return context?.user?.username || "friend";
  }, [context]);

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const handleSendShoutout = async (friendUsername: string) => {
    // Create a personalized shoutout message
    const shoutoutMessage = `Just wanted to give a huge shoutout to @${friendUsername}! 🙌 #ShoutoutGenerator`;

    try {
      // Use composeCast instead of deeplinking
      await sdk.actions.composeCast({
        text: shoutoutMessage,
      });
    } catch (error) {
      console.error("Error composing cast:", error);
      // Fallback to openUrl if composeCast fails
      openUrl(
        `https://warpcast.com/~/compose?text=${encodeURIComponent(shoutoutMessage)}`,
      );
    }
  };

  const handleShareShoutout = async (friendUsername: string) => {
    // Only proceed if we have a valid username
    if (!friendUsername) {
      console.error("Cannot share shoutout: friendUsername is undefined");
      return;
    }

    // Create the share message
    const shareMessage = `I just shouted out @${friendUsername} using Shoutout Generator 🙌\n${BASE_URL}`;

    // Create the OG image URL
    const ogImageUrl = `${BASE_URL}/api/og-image?username=${encodeURIComponent(username)}&friend=${encodeURIComponent(friendUsername)}`;

    try {
      // Use composeCast instead of deeplinking
      await sdk.actions.composeCast({
        text: shareMessage,
        embeds: [ogImageUrl],
      });
    } catch (error) {
      console.error("Error composing cast with embed:", error);
      // Fallback to openUrl if composeCast fails
      const shareUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareMessage)}&embeds[]=${encodeURIComponent(ogImageUrl)}`;
      openUrl(shareUrl);
    }
  };

  return (
    <div className="flex flex-col min-h-screen sm:min-h-[820px] font-sans bg-[#E5E5E5] text-black items-center snake-dark relative">
      <div className="w-screen max-w-[520px]">
        {/* Header with user info */}
        <div className="p-3">
          <UserHeader username={username} fid={context?.user?.fid} />
        </div>

        <main className="font-serif p-4">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Shoutout Generator</h1>
            <p className="text-gray-600">
              Choose a friend to send a personalized shoutout
            </p>
            <button
              type="button"
              className="mt-4 ml-4 px-2 py-1 flex justify-start rounded-2xl font-semibold opacity-40 border border-black text-xs"
              onClick={() => openUrl("https://base.org/builders/minikit")}
            >
              BUILT ON BASE WITH MINIKIT
            </button>
          </div>

          <ShoutoutCard
            username={username}
            message="You're awesome!"
            type="primary"
          />

          {/* Friends list section */}
          <h2 className="text-xl font-bold mt-8 mb-4">Your Friends</h2>

          {followers && followers.length > 0 ? (
            <>
              {paginatedFollowers.map((friend) => {
                const validUsername = friend.username || `friend${friend.fid}`;

                return (
                  <ShoutoutCard
                    key={friend.fid}
                    username={validUsername}
                    message={`Send a personalized shoutout to @${validUsername}!`}
                    type="friend"
                    onSendShoutout={() => handleSendShoutout(validUsername)}
                    onShareShoutout={() => handleShareShoutout(validUsername)}
                  />
                );
              })}

              {/* Pagination controls */}
              <div className="flex justify-center mt-6 space-x-4">
                {currentPage > 0 && (
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="px-4 py-2 bg-violet-100 hover:bg-violet-200 text-violet-800 rounded-md transition-colors"
                  >
                    Previous
                  </button>
                )}

                {hasMorePages && (
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-md transition-colors"
                  >
                    Next 4 Friends
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No friends found. Try following more people on Farcaster!
            </div>
          )}

          <ActionButtons appUrl={BASE_URL} />
        </main>
      </div>
    </div>
  );
}
