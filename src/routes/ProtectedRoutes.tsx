import type { JSX } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@stores/useAuthStore';

interface ProtectedRouteProps {
  element?: JSX.Element;
  requireScope?: string | string[];
  path?: string;
  index?: boolean;
}

export default function ProtectedRoute({
  element,
  requireScope,
}: ProtectedRouteProps) {
  const { isAuthenticated, userScope } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  if (requireScope) {
    const scopesRequired = Array.isArray(requireScope)
      ? requireScope
      : [requireScope];
    const hasScope = scopesRequired.every((scope) =>
      userScope?.includes(scope),
    );

    if (!hasScope) {
      return <Navigate to='/403' replace />;
    }
  }

  return element ?? <Outlet />;
}
