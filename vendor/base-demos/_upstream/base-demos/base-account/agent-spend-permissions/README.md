# Zora Coin Agent

An AI-powered Next.js application that allows users to buy Zora creator coins through a chat interface using Base Account spend permissions. Features gas-free transactions and seamless AI-driven purchases.

## Features

- **Sign in with Base**: Secure authentication using Base Account
- **Flexible Spend Permissions**: Set daily spend permissions ($1-$2) for safe testing
- **AI Chat Interface**: Natural language interaction powered by GPT-4 to buy Zora creator coins
- **CDP Smart Accounts**: Server wallets with gas sponsorship for seamless transactions
- **Gas-Free Experience**: All transactions sponsored via CDP paymaster
- **Auto-Transfer**: Purchased coins automatically transferred to user's wallet
- **Activity Integration**: Direct links to Base Account activity page
- **Retry Logic**: Robust transaction handling with automatic retries

## How It Works

1. **Base Account**: User signs in and grants spend permission to server wallet's smart account
2. **Frontend**: Prepares spend permission calls and sends to backend
3. **AI Agent**: GPT-4 processes natural language requests and decides to buy creator coins
4. **Server Wallet**: CDP Smart Account executes spend calls, swaps USDC for creator coins, transfers to user
5. **Base Chain**: Transactions execute on-chain with gas sponsorship

## Key Components

- **🔐 Spend Permissions**: User grants limited spending authority to server wallet's smart account
- **⛽ Gas Sponsorship**: All transactions sponsored using CDP's paymaster - no ETH needed

## Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Configure environment variables**:

   ```bash
   cp .env.example .env.local
   ```

   Fill in the required values:
   - `CDP_API_KEY_ID` - Your Coinbase Developer Platform API Key ID
   - `CDP_API_KEY_SECRET` - Your CDP API Key Secret
   - `CDP_WALLET_SECRET` - Your CDP Wallet Secret
   - `OPENAI_API_KEY` - Your OpenAI API Key
   - `PAYMASTER_URL` - Your CDP Paymaster URL for gas sponsorship
   - `ZORA_API_KEY` - Your Zora API Key (optional, prevents rate limiting - get it from [Developer Settings on Zora](https://zora.co/settings/developer))

   **Optional for production:**
   - `SESSION_SECRET` - Only needed if implementing proper JWT sessions (generate with `openssl rand -hex 32`)

3. **Run the development server**:

   ```bash
   npm run dev
   ```

4. **Open the application**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Sign In**: Click "Sign in with Base" to connect your wallet
2. **Set Permissions**: Configure your daily spend permission ($1-$2) for safe testing
3. **Chat**: Start chatting with the AI agent to buy Zora coins
4. **View Activity**: Check your purchased coins at [account.base.app/activity](https://account.base.app/activity)

### Example Prompts

- "Buy $1 worth of @username's creator coin"
- "I want to purchase coins for the user 'artistname'"
- "Get me $2 of coins from the profile @creator"

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Base Account with Sign in with Base
- **Smart Accounts**: Coinbase Developer Platform (CDP) SDK with gas sponsorship
- **AI**: OpenAI GPT-4 with Function Calling
- **Blockchain**: Base Mainnet (Ethereum L2)
- **Spend Permissions**: Base Account spend permission system
- **Creator Coins**: Zora protocol integration

## API Routes

- `POST /api/auth/verify` - Verify wallet signature and create session
- `GET/POST /api/wallet/create` - Create/retrieve server wallet and smart account for user
- `POST /api/zora/buy` - Execute creator coin purchase with spend permissions
- `POST /api/chat` - Chat with AI agent (returns tool calls to frontend)

## Security Features

- Server-side signature verification
- Session-based authentication
- Low spend permission limits ($1-$2 daily)
- CDP Smart Account security
- Gas-sponsored transactions (no user ETH required)
- Automatic token transfers to user wallet
- Transaction retry logic for reliability

## Architecture Details

### Flow

1. **Frontend** prepares spend permission calls using Base Account SDK
2. **Backend** receives calls and executes via CDP Smart Account
3. **CDP** handles USDC approval for Permit2 contract
4. **Swap** executed using CDP's built-in swap functionality
5. **Transfer** all purchased creator coins to user's wallet
6. **Redirect** user to Base Account activity page

### Key Technical Decisions

- **Gas Sponsorship**: Uses CDP paymaster for all transactions
- **Smart Accounts**: Server-managed CDP smart accounts for each user
- **Spend Permissions**: Frontend prepares calls, backend executes
- **Retry Logic**: Up to 3 attempts for swap operations
- **Auto-Transfer**: Ensures user receives coins in their wallet

## Development

To extend this application:

1. **Add more AI tools**: Extend OpenAI function definitions in `src/lib/openai.ts`
2. **Enhanced UI**: Improve the chat interface and user experience
3. **Analytics**: Add transaction tracking and user analytics
4. **Multi-token support**: Extend beyond USDC for different token swaps

## License

MIT License - see LICENSE file for details.
