import { Composition } from 'remotion';
import { z } from 'zod';
import {
  AppFactoryDemo,
  type AppFactoryDemoProps,
} from './compositions/AppFactoryDemo';

// Schema for AppFactoryDemo (10s demo video)
const AppFactoryDemoSchema = z.object({
  title: z.string(),
  slug: z.string(),
  verifiedUrl: z.string(),
  timestamp: z.string(),
  highlights: z.array(z.string()),
  certificateHash: z.string(),
});

// DETERMINISM: Static default props for reproducible studio preview
const demoDefaultProps: AppFactoryDemoProps = {
  title: 'AppFactory Demo',
  slug: 'demo-app',
  verifiedUrl: 'http://localhost:3000',
  timestamp: '2026-01-01T00:00:00.000Z',
  highlights: [
    'Clean install verified',
    'Build completed successfully',
    'Dev server healthy',
    'All checks passed',
  ],
  certificateHash: 'sha256:example',
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 10s demo video for user apps (16:9) */}
      <Composition
        id="AppFactoryDemo"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={AppFactoryDemo as any}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        schema={AppFactoryDemoSchema}
        defaultProps={demoDefaultProps}
      />
    </>
  );
};
