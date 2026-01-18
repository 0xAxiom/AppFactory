import React, { useState } from "react";

interface ShoutoutCardProps {
  username: string;
  message?: string;
  type: "primary" | "friend";
  isLoading?: boolean;
  onSendShoutout?: () => void;
  onShareShoutout?: () => void;
}

export default function ShoutoutCard({
  username,
  message = "You're awesome!",
  type,
  isLoading = false,
  onSendShoutout,
  onShareShoutout,
}: ShoutoutCardProps) {
  const [hasShoutedOut, setHasShoutedOut] = useState(false);

  if (isLoading) {
    return (
      <div className="w-full rounded-lg border bg-card text-card-foreground shadow-sm mb-4 animate-pulse">
        <div className="p-6 flex flex-col items-center space-y-3">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const handleSendShoutout = () => {
    if (onSendShoutout) {
      onSendShoutout();
      setHasShoutedOut(true);
    }
  };

  return (
    <div className={`w-full rounded-lg border shadow-sm mb-4 ${
      type === "primary" 
        ? "border-violet-200 bg-violet-50" 
        : hasShoutedOut 
          ? "border-green-200 bg-green-50"
          : "border-neutral-200 bg-neutral-50"
    }`}>
      <div className="p-6 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-2">
          {type === "primary" ? (
            <>Shoutout to <span className="text-violet-600">@{username}</span>!</>
          ) : hasShoutedOut ? (
            <>You shouted out <span className="text-green-600">@{username}</span>!</>
          ) : (
            <>Say hi to your friend <span className="text-violet-600">@{username}</span>!</>
          )}
        </h2>
        <p className="text-center text-gray-600 mb-4">
          {hasShoutedOut ? "Great job spreading positivity!" : message}
        </p>
        
        {type === "friend" && !hasShoutedOut && onSendShoutout && (
          <button
            onClick={handleSendShoutout}
            className="bg-violet-500 hover:bg-violet-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Send Shoutout to @{username}
          </button>
        )}

        {type === "friend" && hasShoutedOut && onShareShoutout && (
          <button
            onClick={onShareShoutout}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Share this Shoutout
          </button>
        )}
      </div>
    </div>
  );
} 