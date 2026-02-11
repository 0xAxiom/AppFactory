import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { useMiniKit, useOpenUrl } from '@coinbase/onchainkit/minikit';

import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const { setFrameReady, isFrameReady } = useMiniKit();
  const openUrl = useOpenUrl();

  useEffect(() => {
    if (!isFrameReady) setFrameReady();
  }, [isFrameReady, setFrameReady]);

  return (
    <>
      <div>
        <button onClick={() => openUrl('https://vite.dev')}>
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </button>
        <button onClick={() => openUrl('https://react.dev')}>
          <img src={reactLogo} className="logo react" alt="React logo" />
        </button>
      </div>
      <h1>Vite + React + Minikit</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
