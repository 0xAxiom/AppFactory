import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from 'remotion';
import { Title } from '../components/Title';
import { BulletPoints } from '../components/BulletPoints';
import { VerificationBadge } from '../components/VerificationBadge';
import { Footer } from '../components/Footer';

export interface AppFactoryDemoProps {
  title: string;
  slug: string;
  verifiedUrl: string;
  timestamp: string;
  highlights: string[];
  certificateHash: string;
}

export const AppFactoryDemo: React.FC<AppFactoryDemoProps> = ({
  title,
  slug,
  verifiedUrl,
  timestamp,
  highlights,
  certificateHash,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Background gradient animation
  const gradientProgress = interpolate(frame, [0, durationInFrames], [0, 360], {
    extrapolateRight: 'clamp',
  });

  // Fade in for entire composition
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Fade out at end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${gradientProgress}deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%)`,
        opacity: opacity * fadeOut,
      }}
    >
      {/* Grid overlay for tech aesthetic */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: '60px',
        }}
      >
        {/* Title section */}
        <Sequence from={0} durationInFrames={durationInFrames}>
          <Title title={title} slug={slug} />
        </Sequence>

        {/* Verification badge */}
        <Sequence from={30} durationInFrames={durationInFrames - 30}>
          <VerificationBadge
            verifiedUrl={verifiedUrl}
            certificateHash={certificateHash}
          />
        </Sequence>

        {/* Bullet points */}
        <Sequence from={60} durationInFrames={durationInFrames - 60}>
          <BulletPoints highlights={highlights} />
        </Sequence>

        {/* Footer */}
        <Sequence from={90} durationInFrames={durationInFrames - 90}>
          <Footer timestamp={timestamp} />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};
