"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type LeaderboardEntry = {
  id: number;
  name: string;
  score: number;
  avatar: string;
};

// Dummy leaderboard data
const dummyLeaderboardData: LeaderboardEntry[] = [
  { id: 1, name: "CardMaster", score: 12, avatar: "👑" },
  { id: 2, name: "LuckyGuesser", score: 10, avatar: "🍀" },
  { id: 3, name: "SharpEye", score: 9, avatar: "👁️" },
  { id: 4, name: "CardWizard", score: 8, avatar: "🧙" },
  { id: 5, name: "MonteKing", score: 7, avatar: "🃏" },
  { id: 6, name: "QuickHands", score: 6, avatar: "👐" },
  { id: 7, name: "Observant", score: 5, avatar: "🔍" },
  { id: 8, name: "Focused", score: 4, avatar: "🎯" },
  { id: 9, name: "Newbie", score: 3, avatar: "🐣" },
  { id: 10, name: "Beginner", score: 2, avatar: "🌱" },
];

// List of avatars to assign randomly
const avatarList = [
  "👑",
  "🍀",
  "👁️",
  "🧙",
  "🃏",
  "👐",
  "🔍",
  "🎯",
  "🐣",
  "🌱",
  "🦊",
  "🐼",
  "🦁",
  "🐯",
  "🦄",
];

interface LeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
  userScore?: number;
  userName?: string;
}

export const Leaderboard = ({
  isOpen,
  onClose,
  userScore,
  userName,
}: LeaderboardProps) => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    [],
  );
  const [userEntryAdded, setUserEntryAdded] = useState(false);

  // Get a random avatar
  const getRandomAvatar = () => {
    return avatarList[Math.floor(Math.random() * avatarList.length)];
  };

  useEffect(() => {
    // In a real app, you would fetch the data from an API
    // For now, we're using the dummy data
    setLeaderboardData([...dummyLeaderboardData]);
    setUserEntryAdded(false);
  }, []);

  useEffect(() => {
    // Check if we need to add a user entry
    if (
      isOpen &&
      userScore !== undefined &&
      userName &&
      !userEntryAdded &&
      userScore > 0
    ) {
      // Create a new entry for the user
      const newUserEntry: LeaderboardEntry = {
        id: Date.now(), // Use timestamp as a unique ID
        name: userName,
        score: userScore,
        avatar: getRandomAvatar(),
      };

      // Add the new entry and sort the leaderboard
      const updatedLeaderboard = [...leaderboardData, newUserEntry]
        .sort((a, b) => b.score - a.score) // Sort by score (highest first)
        .slice(0, 10); // Keep only top 10

      setLeaderboardData(updatedLeaderboard);
      setUserEntryAdded(true);
    }
  }, [isOpen, userScore, userName, leaderboardData, userEntryAdded]);

  if (!isOpen) return null;

  // Find user's position in the leaderboard
  const userPosition = userName
    ? leaderboardData.findIndex((entry) => entry.name === userName)
    : -1;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-md bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg overflow-hidden shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-yellow-300">
                🏆 Leaderboard
              </h2>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-700 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-400 hover:text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-4">
              {userScore !== undefined && userName && (
                <div className="mb-4 p-3 bg-blue-900/40 rounded-lg border border-blue-700/50">
                  <p className="text-center text-white">
                    {userName}&apos;s score:{" "}
                    <span className="font-bold text-yellow-300">
                      {userScore}
                    </span>
                    {userPosition >= 0 && (
                      <span className="ml-2 text-sm text-blue-300">
                        (Rank: {userPosition + 1})
                      </span>
                    )}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                {leaderboardData.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    className={`flex items-center p-3 rounded-lg ${
                      entry.name === userName
                        ? "bg-blue-900/30 border border-blue-700/50"
                        : index < 3
                          ? "bg-gradient-to-r from-gray-800 to-gray-700"
                          : "bg-gray-800/50"
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex-shrink-0 w-8 text-center font-bold">
                      {index === 0
                        ? "🥇"
                        : index === 1
                          ? "🥈"
                          : index === 2
                            ? "🥉"
                            : `#${index + 1}`}
                    </div>

                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-lg mr-2">
                      {entry.avatar}
                    </div>

                    <div className="flex-grow">
                      <p className="font-medium text-white">
                        {entry.name}
                        {entry.name === userName && (
                          <span className="ml-2 text-xs text-blue-300">
                            (You)
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="flex-shrink-0 font-bold text-yellow-300">
                      {entry.score}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
