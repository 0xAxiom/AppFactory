"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface GameControlsProps {
  onStart: () => void;
  onReset: () => void;
  onShuffle: () => void;
  gameStarted: boolean;
  gameEnded: boolean;
  isShuffling: boolean;
}

export const GameControls = ({
  onStart,
  onReset,
  onShuffle,
  gameStarted,
  gameEnded,
  isShuffling,
}: GameControlsProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
      {!gameStarted && (
        <Button
          onClick={onStart}
          className="bg-green-600 hover:bg-green-700 text-sm sm:text-base px-3 sm:px-4"
        >
          Start Game
        </Button>
      )}

      {gameStarted && !gameEnded && (
        <Button
          onClick={onShuffle}
          disabled={isShuffling}
          className="bg-blue-600 hover:bg-blue-700 text-sm sm:text-base px-3 sm:px-4"
        >
          {isShuffling ? (
            <>
              <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
              Shuffling...
            </>
          ) : (
            "Shuffle Again"
          )}
        </Button>
      )}

      {(gameEnded || gameStarted) && (
        <Button
          onClick={onReset}
          variant="outline"
          className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/10 text-sm sm:text-base px-3 sm:px-4"
        >
          New Game
        </Button>
      )}
    </div>
  );
};
