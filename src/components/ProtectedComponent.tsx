import type { JSX } from 'react';
import { useAuthStore } from '@stores/useAuthStore';
import matchesScope from '@utils/matchesScope';

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

    const hasScope = scopesRequired.every((required) =>
      userScope?.some((user) => matchesScope(user, required)),
    );

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
    <div className='border border-destructive bg-destructive/20 text-destructive rounded-sm p-2'>
      Missing Permission: {requireScope.join(', ')}
    </div>
  );
}
