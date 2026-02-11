import { ConnectButton, WalletButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        padding: 12,
      }}
    >
      <ConnectButton />
      <WalletButton wallet="baseAccount" />
    </div>
  );
};

export default Home;
