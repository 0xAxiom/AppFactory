import { NextRequest } from "next/server";
import { put } from "@vercel/blob";

// Force dynamic rendering to ensure fresh image generation on each request
export const dynamic = "force-dynamic";

/**
 * POST handler for saving captured images to Blob storage
 * @param request - The incoming HTTP request with displayName and base64 image data
 * @returns JSON with the blob URL
 */
export async function POST(request: NextRequest) {
  try {
    // Extract the displayName and imageData from the request body
    const { displayName, imageData } = await request.json();

    console.log(
      "📸 [SAVE-IMAGE] Incoming request for displayName:",
      displayName,
    );

    if (!displayName) {
      console.log("❌ [SAVE-IMAGE] Missing displayName parameter");
      return new Response("Missing displayName parameter", { status: 400 });
    }

    if (!imageData) {
      console.log("❌ [SAVE-IMAGE] Missing imageData parameter");
      return new Response("Missing imageData parameter", { status: 400 });
    }

    // Log image data details
    const imageDataType = imageData.substring(0, 50) + "...";
    const imageDataLength = imageData.length;
    console.log(
      "📊 [SAVE-IMAGE] Received image data:",
      imageDataType,
      "Total length:",
      imageDataLength,
    );

    // Ensure imageData is properly formatted (should be a data URL)
    if (!imageData.startsWith("data:image/")) {
      console.log(
        "❌ [SAVE-IMAGE] Invalid image data format, starts with:",
        imageData.substring(0, 20),
      );
      return new Response("Invalid image data format", { status: 400 });
    }

    // Convert the base64 data URL to a buffer
    const base64Data = imageData.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");
    const bufferSize = buffer.length;

    console.log(
      "🔄 [SAVE-IMAGE] Converted to buffer, size:",
      bufferSize,
      "bytes",
    );

    // Convert buffer to ReadableStream for Vercel Blob
    const readableStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array(buffer));
        controller.close();
      },
    });

    // Remove spaces and URL encode the displayName to handle special characters like parentheses
    const cleanDisplayName = displayName.replace(/\s+/g, "");
    const encodedDisplayName = encodeURIComponent(cleanDisplayName);
    const filename = `images/${encodedDisplayName}.png`;

    console.log(
      "🔄 [SAVE-IMAGE] Uploading to blob storage with filename:",
      filename,
    );

    // Save the image to Vercel Blob with encoded filename
    const blob = await put(filename, readableStream, {
      access: "public",
      contentType: "image/png",
      allowOverwrite: true,
    });

    console.log("✅ [SAVE-IMAGE] Successfully saved to blob:", blob.url);

    // Return the blob URL
    return Response.json({ blobUrl: blob.url });
  } catch (err: unknown) {
    console.error("❌ API error in /api/save-image:", err);
    return new Response(
      `Failed to save image: ${err instanceof Error ? err.message : String(err)}`,
      {
        status: 500,
      },
    );
  }
}
