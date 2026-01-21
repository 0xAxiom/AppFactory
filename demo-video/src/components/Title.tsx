import { interpolate, useCurrentFrame, spring, useVideoConfig } from 'remotion';

interface TitleProps {
  title: string;
  slug: string;
}

export const Title: React.FC<TitleProps> = ({ title, slug }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring animation for title entrance
  const titleSpring = spring({
    frame,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
      mass: 0.5,
    },
  });

  // Slide up and fade in
  const translateY = interpolate(titleSpring, [0, 1], [50, 0]);
  const opacity = interpolate(titleSpring, [0, 1], [0, 1]);

  // Slug animation (delayed)
  const slugSpring = spring({
    frame: frame - 15,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
      mass: 0.5,
    },
  });

  const slugOpacity = interpolate(slugSpring, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '40px',
      }}
    >
      {/* AppFactory branding */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '20px',
          opacity,
          transform: `translateY(${translateY}px)`,
        }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
          }}
        >
          <span style={{ fontSize: '32px', color: '#fff', fontWeight: 'bold' }}>
            A
          </span>
        </div>
        <span
          style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#a5b4fc',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}
        >
          AppFactory
        </span>
      </div>

      {/* Main title */}
      <h1
        style={{
          fontSize: '72px',
          fontWeight: '800',
          color: '#ffffff',
          textAlign: 'center',
          margin: 0,
          opacity,
          transform: `translateY(${translateY}px)`,
          textShadow: '0 4px 30px rgba(99, 102, 241, 0.3)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {title}
      </h1>

      {/* Slug badge */}
      <div
        style={{
          marginTop: '16px',
          padding: '8px 24px',
          borderRadius: '999px',
          background: 'rgba(99, 102, 241, 0.2)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          opacity: slugOpacity,
        }}
      >
        <span
          style={{
            fontSize: '20px',
            color: '#a5b4fc',
            fontFamily: 'monospace',
          }}
        >
          {slug}
        </span>
      </div>
    </div>
  );
};
