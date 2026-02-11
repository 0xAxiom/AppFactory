import { interpolate, useCurrentFrame, spring, useVideoConfig } from 'remotion';

interface BulletPointsProps {
  highlights: string[];
}

export const BulletPoints: React.FC<BulletPointsProps> = ({ highlights }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginTop: '40px',
        width: '100%',
        maxWidth: '800px',
      }}
    >
      {highlights.map((highlight, index) => {
        // Stagger each bullet point
        const delay = index * 12;
        const bulletSpring = spring({
          frame: frame - delay,
          fps,
          config: {
            damping: 100,
            stiffness: 200,
            mass: 0.5,
          },
        });

        const translateX = interpolate(bulletSpring, [0, 1], [-30, 0], {
          extrapolateLeft: 'clamp',
        });
        const opacity = interpolate(bulletSpring, [0, 1], [0, 1], {
          extrapolateLeft: 'clamp',
        });

        // Checkmark animation (after bullet appears)
        const checkDelay = delay + 8;
        const checkSpring = spring({
          frame: frame - checkDelay,
          fps,
          config: {
            damping: 80,
            stiffness: 300,
            mass: 0.3,
          },
        });
        const checkScale = interpolate(checkSpring, [0, 1], [0, 1], {
          extrapolateLeft: 'clamp',
        });

        return (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              padding: '20px 30px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              opacity,
              transform: `translateX(${translateX}px)`,
            }}
          >
            {/* Checkmark circle */}
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `scale(${checkScale})`,
                boxShadow: '0 2px 10px rgba(34, 197, 94, 0.3)',
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            {/* Highlight text */}
            <span
              style={{
                fontSize: '26px',
                color: '#e2e8f0',
                fontWeight: '500',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
            >
              {highlight}
            </span>
          </div>
        );
      })}
    </div>
  );
};
