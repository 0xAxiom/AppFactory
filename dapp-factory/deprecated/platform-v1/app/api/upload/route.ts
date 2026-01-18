import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";

// Required files for a valid build
const REQUIRED_FILES = [
  "package.json",
  "src/app/page.tsx",
  "src/app/layout.tsx",
];

// Rate limiting (in-memory for demo, use Redis in production)
const uploadAttempts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // uploads per hour
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = uploadAttempts.get(ip);

  if (!record || now > record.resetAt) {
    uploadAttempts.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

// Upload storage (in-memory for demo, use S3/R2 in production)
const uploads = new Map<
  string,
  {
    id: string;
    files: string[];
    validated: boolean;
    createdAt: string;
    ip: string;
  }
>();

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: "rate_limited",
          message: "Too many uploads. Please wait an hour and try again.",
        },
        { status: 429 }
      );
    }

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: "missing_file",
          message: "No file uploaded",
        },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.endsWith(".zip")) {
      return NextResponse.json(
        {
          success: false,
          error: "invalid_type",
          message: "File must be a .zip archive",
        },
        { status: 400 }
      );
    }

    // Validate file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        {
          success: false,
          error: "file_too_large",
          message: "File must be under 50MB",
        },
        { status: 400 }
      );
    }

    // Read zip contents
    // In production, use a proper zip library like yauzl
    // For now, we'll simulate validation
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Check zip signature (PK header)
    if (buffer[0] !== 0x50 || buffer[1] !== 0x4b) {
      return NextResponse.json(
        {
          success: false,
          error: "invalid_zip",
          message: "File is not a valid zip archive",
        },
        { status: 400 }
      );
    }

    // Generate upload ID
    const uploadId = `up_${crypto.randomBytes(12).toString("hex")}`;

    // Simulate file list extraction
    // In production, actually extract and validate the zip
    const simulatedFiles = [
      "package.json",
      "tsconfig.json",
      "next.config.js",
      "tailwind.config.ts",
      "src/app/layout.tsx",
      "src/app/page.tsx",
      "src/app/providers.tsx",
      "src/app/globals.css",
    ];

    // Check for required files
    const missingFiles = REQUIRED_FILES.filter(
      (required) => !simulatedFiles.includes(required)
    );

    if (missingFiles.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "missing_files",
          missing: missingFiles,
          message: `Missing required files: ${missingFiles.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Store upload record
    uploads.set(uploadId, {
      id: uploadId,
      files: simulatedFiles,
      validated: true,
      createdAt: new Date().toISOString(),
      ip,
    });

    // In production:
    // 1. Store the zip file to S3/R2
    // 2. Extract and validate contents
    // 3. Store metadata in database

    return NextResponse.json({
      success: true,
      upload_id: uploadId,
      status: "validated",
      files: simulatedFiles,
      next_step: "Fill out the launch form",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "server_error",
        message: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

// Get upload status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const uploadId = searchParams.get("id");

  if (!uploadId) {
    return NextResponse.json(
      { success: false, error: "missing_id" },
      { status: 400 }
    );
  }

  const upload = uploads.get(uploadId);

  if (!upload) {
    return NextResponse.json(
      { success: false, error: "not_found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    upload,
  });
}
