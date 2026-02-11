import { createRoot } from 'react-dom/client';
import { Provider } from './providers/provider.tsx';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <Provider>
    <App />
  </Provider>
);
