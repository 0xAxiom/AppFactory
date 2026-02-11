// Game contract address on Base testnet
export const GAME_CONTRACT_ADDRESS_SEPOLIA =
  '0x419B105889c0670F051045ADcc0111d3E86077ee';
export const GAME_CONTRACT_ADDRESS_SIGNED_SEPOLIA =
  '0xDC587Db60a0c58ae7bf2D3a49dA340dB9d4b4EA7';

// Game contract address on Base network
// export const GAME_CONTRACT_ADDRESS =
//   '0x2A7905F0F2F507f7CD91a7A0B0A8138120158E70';

export const GAME_CONTRACT_ADDRESS =
  '0x9a68a6af680E33c59B7e1c34eCc8bbedf6b5B75B';
export const GAME_CONTRACT_ADDRESS_SIGNED =
  '0xE323a94B01ABfE4CEa4A2494e655d87dCA68B697';

// Paymaster URL for gasless transactions
if (!process.env.NEXT_PUBLIC_PAYMASTER_URL) {
  console.warn(
    'Warning: NEXT_PUBLIC_PAYMASTER_URL is not set in environment variables'
  );
}
if (!process.env.NEXT_PUBLIC_PAYMASTER_URL_SEPOLIA) {
  console.warn(
    'Warning: NEXT_PUBLIC_PAYMASTER_URL_SEPOLIA is not set in environment variables'
  );
}

export const PAYMASTER_URL = process.env.NEXT_PUBLIC_PAYMASTER_URL as string;
export const PAYMASTER_URL_SEPOLIA =
  process.env.NEXT_PUBLIC_PAYMASTER_URL_SEPOLIA;

// Fee required to start a game (in ETH)
export const PLAY_FEE_ETH = '0.0001'; // 0.0001 ETH
export const PLAY_FEE_USDC = '0.1'; // 10 cents
