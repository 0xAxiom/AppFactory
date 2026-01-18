import { useAddFrame, useOpenUrl, useNotification } from "@coinbase/onchainkit/minikit";
import { useState, useCallback } from "react";
interface ActionButtonsProps {
  appUrl?: string;
}

export default function ActionButtons({ appUrl = process.env.NEXT_PUBLIC_URL || "https://base.org/builders/minikit" }: ActionButtonsProps) {
  const [isSaved, setIsSaved] = useState(false);

  // MiniKit hooks for Frame integration
  const addFrame = useAddFrame(); // Allows users to save this Mini App to their Farcaster profile
  const openUrl = useOpenUrl(); // Opens external URLs from within the Mini App
  const sendNotification = useNotification(); // Sends notifications to the user

  /**
   * Handle saving the app to the user's profile
   * useAddFrame() adds the current Frame to the user's profile for future access
   * useNotification() is called only on success to confirm the action to the user
   */
  const handleSave = useCallback(async () => {
    try {
      const result = await addFrame();
      if (result) {
        setIsSaved(true);
        sendNotification({
          title: "Thanks for adding Shoutout Generator 🎉",
          body: "Generate shoutouts anytime!",
        });
      }
    } catch (error) {
      console.error("Error saving frame:", error);
    }
  }, [addFrame, sendNotification]);

  const handleShare = useCallback(() => {
    openUrl(appUrl);
  }, [openUrl, appUrl]);

  return (
    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full mt-6">
      {!isSaved ? (
        <button
          onClick={handleSave}
          aria-label="Save this app to your profile"
          className="py-2 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 flex-1 transition-colors duration-200"
        >
          Save This App
        </button>
      ) : (
        <button
          disabled
          aria-label="App has been saved to your profile"
          className="py-2 px-6 bg-green-600 text-white font-semibold rounded-lg shadow-md flex-1 flex items-center justify-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Saved!
        </button>
      )}

      <button
        onClick={handleShare}
        aria-label="Share this app with others"
        className="py-2 px-6 bg-violet-600 text-white font-semibold rounded-lg shadow-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-75 flex-1 transition-colors duration-200"
      >
        Share
      </button>
    </div>
  );
} 