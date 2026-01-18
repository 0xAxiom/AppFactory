This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-onchain`]().

## Onchain Hangman

# MIT

## Onchain Win Recording

When a user wins, their address is recorded onchain via the `/api/win` endpoint using a Coinbase CDP account. See `RrcordOnchainSteps.md` for details. You must set the following in your `.env.local`:

- CDP_API_KEY_ID
- CDP_API_KEY_SECRET
- CDP_WALLET_SECRET
- CDP_SIGNER_ADDRESS
- GAME_CONTRACT_ADDRESS_SEPOLIA
