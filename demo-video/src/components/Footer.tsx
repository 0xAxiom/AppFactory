import { interpolate, useCurrentFrame, spring, useVideoConfig } from 'remotion';

interface FooterProps {
  timestamp: string;
}

export const Footer: React.FC<FooterProps> = ({ timestamp }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Footer entrance animation
  const footerSpring = spring({
    frame,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
      mass: 0.5,
    },
  });

  const translateY = interpolate(footerSpring, [0, 1], [20, 0], {
    extrapolateLeft: 'clamp',
  });
  const opacity = interpolate(footerSpring, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
  });

  // Format timestamp for display
  const formatTimestamp = (ts: string): string => {
    try {
      const date = new Date(ts);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      });
    } catch {
      return ts;
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '40px',
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {/* Divider line */}
      <div
        style={{
          width: '200px',
          height: '1px',
          background:
            'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3), transparent)',
          marginBottom: '16px',
        }}
      />

      {/* Timestamp */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#64748b"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span
          style={{
            fontSize: '16px',
            color: '#64748b',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {formatTimestamp(timestamp)}
        </span>
      </div>

      {/* Powered by line */}
      <span
        style={{
          fontSize: '14px',
          color: '#475569',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        Powered by Local Run Proof
      </span>
    </div>
  );
};
