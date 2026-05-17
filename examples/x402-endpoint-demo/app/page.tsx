export default function Home() {
  return (
    <main
      style={{
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
        background: "#0a0a0a",
        color: "#e5e5e5",
        minHeight: "100vh",
        padding: "64px 24px",
        maxWidth: "720px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em" }}>
        x402 URL Inspector
      </h1>
      <p style={{ color: "#94a3b8", marginTop: 12 }}>
        Pay-per-call API built with Next.js + x402-next. Canonical demo for
        AppFactory&apos;s x402-endpoint template.
      </p>

      <h2 style={{ fontSize: 18, marginTop: 32, color: "#cbd5e1" }}>
        Discover
      </h2>
      <pre style={preStyle}>GET /api/manifest</pre>

      <h2 style={{ fontSize: 18, marginTop: 24, color: "#cbd5e1" }}>
        Call (returns 402 without payment)
      </h2>
      <pre style={preStyle}>
        {`curl -X POST \\
  -H "content-type: application/json" \\
  -d '{"url":"https://example.com"}' \\
  https://this-deployment/api/inspect`}
      </pre>

      <p style={{ color: "#64748b", marginTop: 32, fontSize: 14 }}>
        Cost: $0.01 USDC per call, settled on Base via x402.
      </p>
    </main>
  );
}

const preStyle: React.CSSProperties = {
  background: "#111827",
  border: "1px solid #1f2937",
  borderRadius: 8,
  padding: 16,
  marginTop: 8,
  overflow: "auto",
  fontSize: 13,
  color: "#e5e7eb",
};
