export default function matchesScope(
  userPerm: string,
  requiredPerm: string,
): boolean {
  if (userPerm === requiredPerm) return true;

  if (userPerm.endsWith(':*')) {
    const prefix = userPerm.slice(0, -2);
    return requiredPerm.startsWith(prefix + ':');
  }

  // TODO: check if requiredPerm ends with wildcard

  return false;
}
