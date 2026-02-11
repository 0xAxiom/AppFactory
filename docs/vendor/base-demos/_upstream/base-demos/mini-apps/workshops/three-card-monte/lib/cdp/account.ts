import { cdp } from "./client";

export async function getCDPAccountByAddress(address: string) {
  // Ensure address is properly formatted
  if (!address.startsWith("0x")) {
    address = `0x${address}`;
  }

  try {
    const account = await cdp.evm.getAccount({
      address: address as `0x${string}`,
    });
    return account;
  } catch (error) {
    console.error("Error retrieving CDP account:", error);
    throw error;
  }
}

// Get all token balances for the account on base-sepolia
export async function getCDPAccountBalance(address: string) {
  const account = await getCDPAccountByAddress(address);
  const balances = await account.listTokenBalances({ network: "base-sepolia" });
  return balances;
}
