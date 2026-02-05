import type { JSX } from 'react';
import { useAuthStore } from '@stores/useAuthStore';

interface Props {
  children: JSX.Element;
  requireScope?: string | string[];
  fallback?: JSX.Element | null;
  showError?: boolean;
}

export default function ProtectedComponent({
  children,
  requireScope,
  showError = false,
  fallback = null,
}: Props) {
  const { isAuthenticated, userScope, isSudo } = useAuthStore();

  if (!isAuthenticated) {
    return fallback;
  }

  if (requireScope && !isSudo) {
    const scopesRequired = Array.isArray(requireScope)
      ? requireScope
      : [requireScope];

    const hasScope = scopesRequired.every((s) => userScope?.includes(s));

    if (!hasScope) {
      return showError ? (
        <RequiredScope requireScope={scopesRequired} />
      ) : (
        fallback
      );
    }
  }

  return children;
}

interface RequiredScopeProps {
  requireScope: string[];
}

function RequiredScope({ requireScope }: RequiredScopeProps) {
  return (
    <div className='border border-red-700 bg-red-200 text-red-700 rounded-sm p-2'>
      Missing Permission: {requireScope.join(', ')}
    </div>
  );
}
