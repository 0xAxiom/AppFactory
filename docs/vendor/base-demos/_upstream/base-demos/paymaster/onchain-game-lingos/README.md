# Lingos - A phrase completion game

An onchain phrase completion game that tests your knowledge of phrases, idioms, and proverbs from around the world. Challenge yourself to recognize and complete common expressions while earning points for correct answers.

🎮 [Play Now](https://play-lingos.vercel.app/)

## Overview

Lingos combines traditional language learning with modern web technologies and blockchain integration. Players can:

- Test their knowledge of international phrases and expressions
- Connect their [Base Smart Wallet](https://docs.base.org/identity/smart-wallet/quickstart) for gasless experience

## Technologies Used

### Frontend

- **Next.js 14** - React framework for production
- **OnchainKit** - Onchain Frontend Library

### Blockchain Integration

- **wagmi** - React Hooks for Ethereum
- **viem** - TypeScript Interface for Ethereum

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm package manager
- A modern web browser
- (Optional) Web3 wallet for full features

### Local Development

1. Clone the repository:

```bash
cd demos/paymaster/onchain-game-lingos
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key
NEXT_PUBLIC_PAYMASTER_PROXY_SERVER_URL=your_proxy_url
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [onchainkit](https://onchainkit.xyz)
- Deployed on [Vercel](https://vercel.com)
- Powered by [Next.js](https://nextjs.org)
