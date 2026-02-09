import matchesScope from '@utils/matchesScope';

export function hasPermission(
  userScopes: string[],
  requiredScope?: string,
): boolean {
  if (!requiredScope) return true;
  return userScopes.some((userScope) => matchesScope(userScope, requiredScope));
}

export function filterItemsByPermission<T extends { scope?: string }>(
  items: T[],
  userScopes: string[],
): T[] {
  return items.filter((item) => hasPermission(userScopes, item.scope));
}
