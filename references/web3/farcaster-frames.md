# Farcaster Frames Reference

## Overview

Farcaster Frames are interactive elements embedded in Farcaster casts. They enable rich interactions like voting, minting NFTs, or playing games directly in the feed.

## Frame Specification

### Basic Frame

A frame is defined by meta tags in an HTML page:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="https://myapp.com/image.png" />
    <meta property="fc:frame:button:1" content="Click me" />
    <meta property="fc:frame:post_url" content="https://myapp.com/api/frame" />
  </head>
</html>
```

### Frame Properties

| Property            | Description                     |
| ------------------- | ------------------------------- |
| fc:frame            | Frame version ("vNext")         |
| fc:frame:image      | Image URL (1.91:1 or 1:1 ratio) |
| fc:frame:button:N   | Button text (N = 1-4)           |
| fc:frame:post_url   | Action endpoint                 |
| fc:frame:input:text | Text input placeholder          |

## With Next.js

### Frame Route

```typescript
// app/frames/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Frame",
  openGraph: {
    title: "My Frame",
    images: ["https://myapp.com/og-image.png"],
  },
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": "https://myapp.com/frame-image.png",
    "fc:frame:button:1": "Vote Yes",
    "fc:frame:button:2": "Vote No",
    "fc:frame:post_url": "https://myapp.com/api/frame/vote",
  },
};

export default function FramePage() {
  return (
    <div>
      <h1>Vote on this proposal</h1>
    </div>
  );
}
```

### API Handler

```typescript
// app/api/frame/vote/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface FrameMessage {
  untrustedData: {
    fid: number;
    buttonIndex: number;
    inputText?: string;
    castId: {
      fid: number;
      hash: string;
    };
  };
  trustedData: {
    messageBytes: string;
  };
}

export async function POST(req: NextRequest) {
  const body: FrameMessage = await req.json();
  const { fid, buttonIndex } = body.untrustedData;

  // Process vote
  const vote = buttonIndex === 1 ? 'yes' : 'no';
  await recordVote(fid, vote);

  // Return new frame
  return new NextResponse(
    `<!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://myapp.com/result.png?vote=${vote}" />
        <meta property="fc:frame:button:1" content="Share" />
        <meta property="fc:frame:button:1:action" content="link" />
        <meta property="fc:frame:button:1:target" content="https://myapp.com" />
      </head>
    </html>`,
    { headers: { 'Content-Type': 'text/html' } }
  );
}
```

## Using Frames.js

### Installation

```bash
npm install frames.js
```

### Define Frame

```typescript
// app/frames/route.tsx
import { createFrames, Button } from "frames.js/next";

const frames = createFrames({
  basePath: "/frames",
});

const handleRequest = frames(async (ctx) => {
  const hasVoted = ctx.message?.buttonIndex;

  if (!hasVoted) {
    return {
      image: <VoteImage />,
      buttons: [
        <Button action="post">Vote Yes</Button>,
        <Button action="post">Vote No</Button>,
      ],
    };
  }

  const vote = ctx.message.buttonIndex === 1 ? "Yes" : "No";

  return {
    image: <ResultImage vote={vote} />,
    buttons: [
      <Button action="link" target="https://myapp.com">
        Learn More
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
```

### Dynamic Images

```typescript
// app/frames/image/route.tsx
import { ImageResponse } from "next/og";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const vote = searchParams.get("vote");

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#1E1E1E",
          color: "white",
        }}
      >
        <h1 style={{ fontSize: 64 }}>You voted: {vote}</h1>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
```

## Button Actions

### Post (Default)

Sends POST to post_url:

```html
<meta property="fc:frame:button:1" content="Click" /> <meta property="fc:frame:button:1:action" content="post" />
```

### Link

Opens URL in browser:

```html
<meta property="fc:frame:button:1" content="Visit Site" />
<meta property="fc:frame:button:1:action" content="link" />
<meta property="fc:frame:button:1:target" content="https://example.com" />
```

### Mint

Triggers NFT mint:

```html
<meta property="fc:frame:button:1" content="Mint" />
<meta property="fc:frame:button:1:action" content="mint" />
<meta property="fc:frame:button:1:target" content="eip155:8453:0x...?tokenId=1" />
```

### Transaction

Triggers wallet transaction:

```html
<meta property="fc:frame:button:1" content="Send" />
<meta property="fc:frame:button:1:action" content="tx" />
<meta property="fc:frame:button:1:target" content="https://myapp.com/api/tx" />
```

## Text Input

```html
<meta property="fc:frame:input:text" content="Enter your name" />
```

Access in handler:

```typescript
const inputText = body.untrustedData.inputText;
```

## Validation

### Verify Frame Message

```typescript
import { validateFrameMessage } from 'frames.js';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { isValid, message } = await validateFrameMessage(body, {
    hubHttpUrl: 'https://nemes.farcaster.xyz:2281',
  });

  if (!isValid) {
    return new NextResponse('Invalid frame message', { status: 400 });
  }

  // Process validated message
  const fid = message.data.fid;
  // ...
}
```

## Common Patterns

### Multi-Step Frame

```typescript
// Store state in URL or database
const step = ctx.searchParams.step || "1";

if (step === "1") {
  return {
    image: <Step1Image />,
    buttons: [
      <Button action="post" target="/frames?step=2">
        Next
      </Button>,
    ],
  };
}

if (step === "2") {
  return {
    image: <Step2Image />,
    textInput: "Enter your answer",
    buttons: [
      <Button action="post" target="/frames?step=3">
        Submit
      </Button>,
    ],
  };
}
```

### With Database

```typescript
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const fid = body.untrustedData.fid;

  // Check if user already participated
  const existing = await db.votes.findFirst({ where: { fid } });

  if (existing) {
    return renderAlreadyVotedFrame();
  }

  // Record vote
  await db.votes.create({
    data: { fid, vote: body.untrustedData.buttonIndex },
  });

  return renderThankYouFrame();
}
```

## Image Requirements

| Aspect Ratio | Recommended Size |
| ------------ | ---------------- |
| 1.91:1       | 1200 x 630 px    |
| 1:1          | 1000 x 1000 px   |

- Max file size: 10 MB
- Supported formats: PNG, JPG, GIF

## Testing

### Warpcast Frame Validator

https://warpcast.com/~/developers/frames

### Local Testing

```bash
# Use ngrok for local testing
ngrok http 3000

# Update frame URLs to ngrok URL
```

## Best Practices

1. **Fast responses** - Frame actions should complete quickly
2. **Clear CTAs** - Make button actions obvious
3. **Mobile-friendly** - Design for mobile viewport
4. **Error handling** - Handle edge cases gracefully
5. **Validate messages** - Always verify frame messages

## Resources

- [Farcaster Frames Spec](https://docs.farcaster.xyz/reference/frames/spec)
- [Frames.js Documentation](https://framesjs.org/)
- [Warpcast Developer Portal](https://warpcast.com/~/developers)
