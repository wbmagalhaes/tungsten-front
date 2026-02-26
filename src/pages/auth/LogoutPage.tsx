import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@stores/useAuthStore';

export default function LogoutPage() {
  const clearTokens = useAuthStore((s) => s.clearTokens);

  useEffect(() => {
    clearTokens();
  }, [clearTokens]);

  return <Navigate to='/login' replace />;
}
