# Waitlist Mini App Quickstart

This is a demo Mini App application built using OnchainKit and the Farcaster SDK. Build a waitlist sign-up mini app for your company that can be published to the Base app and Farcaster.

> [!IMPORTANT]  
> Before interacting with this demo, please review our [disclaimer](#disclaimer) — there are **no official tokens or apps** associated with Cubey, Base, or Coinbase.

## Prerequisites

Before getting started, make sure you have:

- Base app account
- A [Farcaster](https://farcaster.xyz/) account
- [Vercel](https://vercel.com/) account for hosting the application
- [Coinbase Developer Platform](https://portal.cdp.coinbase.com/) Client API Key

## Getting Started

### 1. Clone this repository

```bash
git clone https://github.com/base/demos.git
```

### 2. Install dependencies:

```bash
cd demos/minikit/waitlist-mini-app-qs
npm install
```

### 3. Configure environment variables

Create a `.env.local` file and add your environment variables:

```bash
NEXT_PUBLIC_PROJECT_NAME="Your App Name"
NEXT_PUBLIC_ONCHAINKIT_API_KEY=<Replace-WITH-YOUR-CDP-API-KEY>
NEXT_PUBLIC_URL=
```

### 4. Run locally:

```bash
npm run dev
```

## Customization

### Update Manifest Configuration

The `minikit.config.ts` file configures your manifest located at `app/.well-known/farcaster.json`.

**Skip the `accountAssociation` object for now.**

To personalize your app, change the `name`, `subtitle`, and `description` fields and add images to your `/public` folder. Then update their URLs in the file.

## Deployment

### 1. Deploy to Vercel

```bash
vercel --prod
```

You should have a URL deployed to a domain similar to: `https://your-vercel-project-name.vercel.app/`

### 2. Update environment variables

Add your production URL to your local `.env` file:

```bash
NEXT_PUBLIC_PROJECT_NAME="Your App Name"
NEXT_PUBLIC_ONCHAINKIT_API_KEY=<Replace-WITH-YOUR-CDP-API-KEY>
NEXT_PUBLIC_URL=https://your-vercel-project-name.vercel.app/
```

### 3. Upload environment variables to Vercel

Add environment variables to your production environment:

```bash
vercel env add NEXT_PUBLIC_PROJECT_NAME production
vercel env add NEXT_PUBLIC_ONCHAINKIT_API_KEY production
vercel env add NEXT_PUBLIC_URL production
```

## Account Association

### 1. Sign Your Manifest

1. Navigate to [Farcaster Manifest tool](https://farcaster.xyz/~/developers/mini-apps/manifest)
2. Paste your domain in the form field (ex: your-vercel-project-name.vercel.app)
3. Click the `Generate account association` button and follow the on-screen instructions for signing with your Farcaster wallet
4. Copy the `accountAssociation` object

### 2. Update Configuration

Update your `minikit.config.ts` file to include the `accountAssociation` object:

```ts
export const minikitConfig = {
  accountAssociation: {
    header: 'your-header-here',
    payload: 'your-payload-here',
    signature: 'your-signature-here',
  },
  frame: {
    // ... rest of your frame configuration
  },
};
```

### 3. Deploy Updates

```bash
vercel --prod
```

## Testing and Publishing

### 1. Preview Your App

Go to [base.dev/preview](https://base.dev/preview) to validate your app:

1. Add your app URL to view the embeds and click the launch button to verify the app launches as expected
2. Use the "Account association" tab to verify the association credentials were created correctly
3. Use the "Metadata" tab to see the metadata added from the manifest and identify any missing fields

### 2. Publish to Base App

To publish your app, create a post in the Base app with your app's URL.

## Learn More

For detailed step-by-step instructions, see the [Create a Mini App tutorial](https://docs.base.org/docs/mini-apps/quickstart/create-new-miniapp/) in the Base documentation.

---

## Disclaimer

This project is a **demo application** created by the **Base / Coinbase Developer Relations team** for **educational and demonstration purposes only**.

**There is no token, cryptocurrency, or investment product associated with Cubey, Base, or Coinbase.**

Any social media pages, tokens, or applications claiming to be affiliated with, endorsed by, or officially connected to Cubey, Base, or Coinbase are **unauthorized and fraudulent**.

We do **not** endorse or support any third-party tokens, apps, or projects using the Cubey name or branding.

> [!WARNING]
> Do **not** purchase, trade, or interact with any tokens or applications claiming affiliation with Coinbase, Base, or Cubey.  
> Coinbase and Base will never issue a token or ask you to connect your wallet for this demo.

For official Base developer resources, please visit:

- [https://base.org](https://base.org)
- [https://docs.base.org](https://docs.base.org)

---
