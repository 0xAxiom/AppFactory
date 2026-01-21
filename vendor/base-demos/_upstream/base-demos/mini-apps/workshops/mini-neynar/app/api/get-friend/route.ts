import { getFollows } from "@/lib/neynar";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get("fid");
    const limit = searchParams.get("limit") || "10";

    if (!fid) {
      return NextResponse.json(
        { error: "Missing required parameter: fid" },
        { status: 400 },
      );
    }

    const follows = await getFollows(Number(fid), Number(limit));

    return NextResponse.json(follows);
  } catch (error) {
    // Handle any errors
    console.error("Error in GET route:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
