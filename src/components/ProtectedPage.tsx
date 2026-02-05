import type { JSX } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@stores/useAuthStore';

interface Props {
  children: JSX.Element;
  requireScope?: string | string[];
}

export default function ProtectedPage({ children, requireScope }: Props) {
  const { isAuthenticated, userScope, isSudo } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    const redirectTo = `/login?cb_url=${encodeURIComponent(
      location.pathname + location.search,
    )}`;
    return <Navigate to={redirectTo} replace />;
  }

  if (requireScope && !isSudo) {
    const scopesRequired = Array.isArray(requireScope)
      ? requireScope
      : [requireScope];

    const hasScope = scopesRequired.every((s) => userScope?.includes(s));

    if (!hasScope) {
      return <Navigate to='/403' replace />;
    }
  }

  return children;
}
