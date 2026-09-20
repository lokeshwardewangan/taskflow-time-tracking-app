import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         staleTime: 60_000,
         gcTime: 5 * 60_000,
         retry: 1,
         refetchOnWindowFocus: false,
      },
      mutations: {
         retry: 0,
      },
   },
});

createRoot(document.getElementById('root')!).render(
   <StrictMode>
      <QueryClientProvider client={queryClient}>
         <App />
      </QueryClientProvider>
   </StrictMode>
);
