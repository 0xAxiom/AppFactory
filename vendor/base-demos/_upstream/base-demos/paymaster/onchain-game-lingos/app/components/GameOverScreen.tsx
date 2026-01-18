import { Button } from './DemoComponents';
import { SaveScoreButton } from './SaveScoreButton';

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
}

export function GameOverScreen({ score, onRestart }: GameOverScreenProps) {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center'>
        <h2 className='text-2xl font-bold mb-4 text-black'>Game Over!</h2>
        <p className='text-lg mb-6 text-black'>Your final score: {score}</p>
        <div className='space-y-4'>
          <SaveScoreButton score={score} />
          <Button
            variant='primary'
            size='lg'
            onClick={onRestart}
            className='w-full text-white'
          >
            Play Again
          </Button>
        </div>
      </div>
    </div>
  );
}
