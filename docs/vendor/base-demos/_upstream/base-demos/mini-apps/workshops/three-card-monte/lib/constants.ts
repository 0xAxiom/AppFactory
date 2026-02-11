export const GAME_CONTRACT_ADDRESS_SEPOLIA =
  "0x7eFc99DF7e8a2b01E2E3d905c37e45F8d3FB227F";

export const PAYMASTER_URL = process.env.NEXT_PUBLIC_PAYMASTER_URL as string;
export const PAYMASTER_URL_SEPOLIA =
  process.env.NEXT_PUBLIC_PAYMASTER_URL_SEPOLIA;

export const CDP_SIGNER_ADDRESS = process.env
  .CDP_SIGNER_ADDRESS as `0x${string}`;

// Fee required to start a game (in ETH)
export const PLAY_FEE_ETH = "0.00001"; // 0.0001 ETH
export const PLAY_FEE_USDC = "0.1"; // 10 cents
export const REWARD_AMOUNT = "0.0001"; // 0.0001 ETH
