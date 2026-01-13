import { NextRequest, NextResponse } from "next/server";

// Demo showcase data (in production, use database)
const demoShowcaseApps = [
  {
    id: "app_roastpush",
    name: "RoastPush",
    description: "Real-time multiplayer roast battle app where users compete in voice-first battles for ROAST token rewards.",
    ticker: "ROAST",
    token_address: "GRv23yBYo1fMqDY8Ws2LqjwHoLx4TGUqYi7KfCDkBAGS",
    creator_wallet: "5abc...",
    draft_url: "https://roastpush.vercel.app",
    production_url: null,
    status: "draft" as const,
    twitter: "@roastpush",
    website: null,
    created_at: "2026-01-12T20:00:00Z",
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      // Get single app
      const app = demoShowcaseApps.find((a) => a.id === id);
      if (!app) {
        return NextResponse.json(
          { success: false, error: "not_found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, app });
    }

    // Get all apps
    return NextResponse.json({
      success: true,
      apps: demoShowcaseApps,
      total: demoShowcaseApps.length,
    });
  } catch (error) {
    console.error("Showcase error:", error);
    return NextResponse.json(
      { success: false, error: "server_error" },
      { status: 500 }
    );
  }
}
