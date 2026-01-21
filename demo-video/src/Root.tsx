import { Composition } from 'remotion';
import {
  AppFactoryDemo,
  AppFactoryDemoProps,
} from './compositions/AppFactoryDemo';

export const RemotionRoot: React.FC = () => {
  const defaultProps: AppFactoryDemoProps = {
    title: 'AppFactory Demo',
    slug: 'demo-app',
    verifiedUrl: 'http://localhost:3000',
    timestamp: new Date().toISOString(),
    highlights: [
      'Clean install verified',
      'Build completed successfully',
      'Dev server healthy',
      'All checks passed',
    ],
    certificateHash: 'sha256:example',
  };

  return (
    <>
      <Composition
        id="AppFactoryDemo"
        component={AppFactoryDemo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={defaultProps}
      />
    </>
  );
};
