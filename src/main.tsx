import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

import { BrowserRouter as Router } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find root element');

const client = new QueryClient();

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <Router>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  </StrictMode>,
);
