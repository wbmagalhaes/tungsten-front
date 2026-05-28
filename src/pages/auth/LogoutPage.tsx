import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@stores/useAuthStore';
import { useLogout } from '@hooks/auth/use-logout';

export default function LogoutPage() {
  const status = useAuthStore((s) => s.status);
  const logout = useLogout();

  useEffect(() => {
    if (status === 'authed' && logout.isIdle) {
      logout.mutate();
    }
  }, [status, logout]);

  if (status === 'unknown' || status === 'authed') {
    return null;
  }

  return <Navigate to='/login' replace />;
}
