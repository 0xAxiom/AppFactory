interface FeedbackOverlayProps {
  isCorrect: boolean;
  message: string;
}

export function FeedbackOverlay({ isCorrect, message }: FeedbackOverlayProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-40 pointer-events-none">
      <div
        className={`bg-white rounded-lg p-6 shadow-lg transform transition-all duration-300 ${
          isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        <p className="text-xl font-bold">{message}</p>
      </div>
    </div>
  );
}
