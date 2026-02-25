import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import AppRoutes from './routes/AppRoutes';

import '@styles/global.css';

const is4xx = (error: unknown) => {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    return status !== undefined && status >= 400 && status < 500;
  }
  return false;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => !is4xx(error) && failureCount < 1,
      retryDelay: 5_000,
      gcTime: 300_000,
    },
    mutations: {
      retry: (failureCount, error) => !is4xx(error) && failureCount < 1,
      retryDelay: 5_000,
      gcTime: 300_000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
    </QueryClientProvider>
  );
}
