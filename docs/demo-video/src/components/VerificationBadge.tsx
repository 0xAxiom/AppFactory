import { interpolate, useCurrentFrame, spring, useVideoConfig } from 'remotion';

interface VerificationBadgeProps {
  verifiedUrl: string;
  certificateHash: string;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  verifiedUrl,
  certificateHash,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Badge entrance animation
  const badgeSpring = spring({
    frame,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
      mass: 0.5,
    },
  });

  const scale = interpolate(badgeSpring, [0, 1], [0.8, 1], {
    extrapolateLeft: 'clamp',
  });
  const opacity = interpolate(badgeSpring, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
  });

  // Glow pulse animation
  const glowIntensity = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.3, 0.6]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      {/* Verified badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px 32px',
          background: 'rgba(34, 197, 94, 0.1)',
          borderRadius: '12px',
          border: '2px solid rgba(34, 197, 94, 0.4)',
          boxShadow: `0 0 30px rgba(34, 197, 94, ${glowIntensity})`,
        }}
      >
        {/* Shield icon */}
        <div
          style={{
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#22c55e"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polyline points="9 12 11 14 15 10" stroke="#22c55e" />
          </svg>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#22c55e',
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}
          >
            Verified
          </span>
          <span
            style={{
              fontSize: '14px',
              color: '#86efac',
              fontFamily: 'monospace',
            }}
          >
            RUN_CERTIFICATE.json PASS
          </span>
        </div>
      </div>

      {/* URL display */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 20px',
          background: 'rgba(99, 102, 241, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(99, 102, 241, 0.2)',
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#a5b4fc"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span
          style={{
            fontSize: '18px',
            color: '#a5b4fc',
            fontFamily: 'monospace',
          }}
        >
          {verifiedUrl}
        </span>
      </div>

      {/* Hash display (truncated) */}
      <span
        style={{
          fontSize: '12px',
          color: '#64748b',
          fontFamily: 'monospace',
        }}
      >
        {certificateHash.length > 32
          ? `${certificateHash.slice(0, 32)}...`
          : certificateHash}
      </span>
    </div>
  );
};
