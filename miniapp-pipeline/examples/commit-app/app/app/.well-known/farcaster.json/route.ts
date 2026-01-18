/**
 * Manifest Route
 * Serves /.well-known/farcaster.json for Base Mini App discovery
 */
import { withValidManifest } from "@coinbase/onchainkit/minikit";
import { minikitConfig } from "@/minikit.config";

export async function GET() {
  return Response.json(withValidManifest(minikitConfig));
}
