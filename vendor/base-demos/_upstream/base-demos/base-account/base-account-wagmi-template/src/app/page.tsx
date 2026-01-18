"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { SignInWithBase } from "../components/SignInWithBase";
import { BatchTransactions } from "../components/BatchTransactions";

function App() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div style={styles.container}>
      <div style={styles.innerContainer}>
        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.title}>🔷 Base Account Demo</h1>
          <p style={styles.subtitle}>
            Sign in to interact with batch transactions and mint NFTs
          </p>
        </header>

        {/* Account Info Card */}
        {account.status === "connected" && (
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Your Account</h2>
              <span style={{
                ...styles.statusBadge,
                backgroundColor: "#10b981",
              }}>
                Signed In
              </span>
            </div>
            <div style={styles.accountInfo}>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Address:</span>
                <code style={styles.infoValue}>
                  {account.addresses?.[0]
                    ? `${account.addresses[0]}`
                    : "N/A"}
                </code>
              </div>
            </div>
            <button
              type="button"
              onClick={() => disconnect()}
              style={styles.disconnectButton}
            >
              Sign Out
            </button>
          </div>
        )}

        {/* Sign In Card */}
        {account.status !== "connected" && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Sign In</h2>
            <p style={styles.cardDescription}>
              Choose your preferred sign-in method to get started
            </p>
            <div style={styles.connectButtons}>
              {connectors.map((connector) => {
                if (connector.name === "Base Account") {
                  return (
                    <SignInWithBase key={connector.uid} connector={connector} />
                  );
                } else {
                  return (
                    <button
                      key={connector.uid}
                      onClick={() => connect({ connector })}
                      type="button"
                      style={styles.connectButton}
                    >
                      Sign in with {connector.name}
                    </button>
                  );
                }
              })}
            </div>
            {status && status !== "idle" && (
              <div style={styles.statusMessage}>
                <span style={styles.statusText}>Status: {status}</span>
              </div>
            )}
            {error && (
              <div style={styles.errorMessage}>
                ⚠️ {error.message}
              </div>
            )}
          </div>
        )}

        {/* Batch Transactions Card */}
        {account.status === "connected" && (
          <div style={styles.card}>
            <BatchTransactions />
          </div>
        )}

        {/* Footer */}
        <footer style={styles.footer}>
          <p style={styles.footerText}>
            Powered by Base • Built with Wagmi
          </p>
        </footer>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "2rem",
  } as React.CSSProperties,
  innerContainer: {
    maxWidth: "800px",
    margin: "0 auto",
  } as React.CSSProperties,
  header: {
    textAlign: "center",
    marginBottom: "3rem",
    color: "white",
  } as React.CSSProperties,
  title: {
    fontSize: "3rem",
    fontWeight: "bold",
    margin: "0 0 1rem 0",
    textShadow: "0 2px 4px rgba(0,0,0,0.1)",
  } as React.CSSProperties,
  subtitle: {
    fontSize: "1.125rem",
    opacity: 0.9,
    margin: 0,
  } as React.CSSProperties,
  card: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "2rem",
    marginBottom: "2rem",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  } as React.CSSProperties,
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  } as React.CSSProperties,
  cardTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#1f2937",
    margin: 0,
  } as React.CSSProperties,
  cardDescription: {
    color: "#6b7280",
    marginBottom: "1.5rem",
  } as React.CSSProperties,
  statusBadge: {
    padding: "0.5rem 1rem",
    borderRadius: "9999px",
    color: "white",
    fontSize: "0.875rem",
    fontWeight: "500",
  } as React.CSSProperties,
  accountInfo: {
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    padding: "1.5rem",
    marginBottom: "1.5rem",
  } as React.CSSProperties,
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.75rem",
  } as React.CSSProperties,
  infoLabel: {
    fontWeight: "500",
    color: "#6b7280",
  } as React.CSSProperties,
  infoValue: {
    color: "#1f2937",
    fontWeight: "500",
  } as React.CSSProperties,
  connectButtons: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    alignItems: "center",
  } as React.CSSProperties,
  connectButton: {
    width: "100%",
    padding: "1rem",
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
  } as React.CSSProperties,
  disconnectButton: {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
  } as React.CSSProperties,
  statusMessage: {
    marginTop: "1rem",
    padding: "0.75rem",
    backgroundColor: "#dbeafe",
    borderRadius: "8px",
    textAlign: "center",
  } as React.CSSProperties,
  statusText: {
    color: "#1e40af",
    fontWeight: "500",
  } as React.CSSProperties,
  errorMessage: {
    marginTop: "1rem",
    padding: "0.75rem",
    backgroundColor: "#fee2e2",
    borderRadius: "8px",
    color: "#991b1b",
    textAlign: "center",
  } as React.CSSProperties,
  footer: {
    textAlign: "center",
    marginTop: "3rem",
    color: "white",
  } as React.CSSProperties,
  footerText: {
    opacity: 0.8,
    fontSize: "0.875rem",
  } as React.CSSProperties,
};

export default App;
