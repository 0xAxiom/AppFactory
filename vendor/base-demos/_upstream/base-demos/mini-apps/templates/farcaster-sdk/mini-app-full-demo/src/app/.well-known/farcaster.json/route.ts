import { METADATA } from "../../../lib/utils";

export async function GET() {
  const config = {
    accountAssociation: {
      header:
        "eyJmaWQiOjEyMTQyLCJ0eXBlIjoiY3VzdG9keSIsImtleSI6IjB4MDRlNkYxMTFlQmY2RkQyNTU3NmQ0ODA0ODA5NjI0MzVEYzNhYThEOCJ9",
      payload: "eyJkb21haW4iOiJmcmFtZXMtdjItZGVtby1saWxhYy52ZXJjZWwuYXBwIn0",
      signature:
        "MHg5MGI1YzA0Zjc3MGY1M2I4M2I3OGQzOTMwNTNjMmJjZjUwNmE3ZThjNDViYmEwNDk2OTcwZTM1ZTQ0YzU2MGU1Nzc4Y2Y1ZTJkNDY2YzE1MWQxNGMzYmFjNzM3ZDcxZGEwZDVjYWJmMGMzZTdhYTc2YzRjMmQ5MmE5NDJhYjkyODFj",
    },
      "frame": {
        "version": "1",
        "name": METADATA.name,
        "iconUrl": METADATA.iconImageUrl,
        "homeUrl": METADATA.homeUrl,
        "imageUrl": METADATA.bannerImageUrl,
        "webhookUrl": `${METADATA.homeUrl}/api/webhook`,
        "splashImageUrl": METADATA.iconImageUrl,
        "splashBackgroundColor": METADATA.splashBackgroundColor,
        "description": METADATA.description,
        "ogTitle": METADATA.name,
        "ogDescription": METADATA.description,
        "ogImageUrl": METADATA.bannerImageUrl,
        "primaryCategory": "developer-tools",
        "requiredCapabilities": [
          "actions.ready",
          "actions.signIn", 
          "actions.openMiniApp",
          "actions.addMiniApp",
          "actions.openUrl",
          "actions.sendToken",
          "actions.viewToken", 
          "actions.composeCast",
          "actions.viewProfile",
          "actions.swapToken",
          "actions.close",
          "actions.viewCast",
          "wallet.getEthereumProvider"
        ],
        "requiredChains": [
          "eip155:8453",
          "eip155:10"
        ],
        "noindex": false,
        "tags": ["base", "baseapp", "miniapp", "demo", "basepay"]
      },
      "baseBuilder": {
        "allowedAddresses": ["0x8342A48694A74044116F330db5050a267b28dD85"],
      }
  };

  return Response.json(config);
}
