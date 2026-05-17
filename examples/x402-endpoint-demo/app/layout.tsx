export const metadata = {
  title: "x402 Endpoint Demo",
  description: "Pay-per-call API built with Vercel AI SDK + x402.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
