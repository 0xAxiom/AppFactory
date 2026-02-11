import { cdp } from './client';

export async function getCDPAccountByAddress(address: string) {
  if (!address.startsWith('0x')) {
    address = `0x${address}`;
  }
  try {
    const account = await cdp.evm.getAccount({
      address: address as `0x${string}`,
    });
    return account;
  } catch (error) {
    console.error('Error retrieving CDP account:', error);
    throw error;
  }
}
