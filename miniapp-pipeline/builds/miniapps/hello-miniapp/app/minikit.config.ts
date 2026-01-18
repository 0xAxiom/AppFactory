/**
 * MiniKit Configuration - Hello Mini App
 *
 * This is the single source of truth for the mini app manifest.
 * The manifest route reads from this file to generate /.well-known/farcaster.json
 */

export const minikitConfig = {
  /**
   * Account Association
   * These values prove you own this domain. Get them from:
   * https://base.dev (Build → Account Association)
   *
   * EXAMPLE VALUES - Replace with your own after signing!
   */
  accountAssociation: {
    header: "eyJmaWQiOjEyMzQ1LCJ0eXBlIjoiY3VzdG9keSIsImtleSI6IjB4MDAwMCJ9",
    payload: "eyJkb21haW4iOiJoZWxsby1taW5pYXBwLnZlcmNlbC5hcHAifQ",
    signature: "0x0000000000000000000000000000000000000000000000000000000000000000"
  },

  /**
   * Mini App Metadata
   */
  miniapp: {
    version: "1",
    name: "Hello Mini App",
    subtitle: "Your first Base mini app",
    description: "A simple example mini app demonstrating the MiniApp Pipeline. Say hello to the Base ecosystem!",
    tagline: "Your first Base mini app",
    primaryCategory: "utility" as const,
    tags: ["hello", "example", "starter", "base"],
    splashBackgroundColor: "#3B82F6",

    // URLs - computed from environment
    get homeUrl() {
      return process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
    },
    get iconUrl() {
      return `${this.homeUrl}/icon.png`;
    },
    get splashImageUrl() {
      return `${this.homeUrl}/splash.png`;
    },
    get heroImageUrl() {
      return `${this.homeUrl}/hero.png`;
    },
    get screenshotUrls() {
      return [`${this.homeUrl}/screenshots/1.png`];
    },
    get ogTitle() {
      return this.name;
    },
    get ogDescription() {
      return this.description;
    },
    get ogImageUrl() {
      return `${this.homeUrl}/og.png`;
    },
  }
} as const;

export type MinikitConfig = typeof minikitConfig;
