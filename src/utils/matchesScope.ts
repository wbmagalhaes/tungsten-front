export default function matchesScope(
  userPerm: string,
  requiredPerm: string,
): boolean {
  if (userPerm === requiredPerm) return true;

  if (userPerm.endsWith(':*')) {
    const prefix = userPerm.slice(0, -2);
    if (requiredPerm.startsWith(prefix + ':')) return true;
  }

  if (requiredPerm.endsWith(':*')) {
    const prefix = requiredPerm.slice(0, -2);
    if (userPerm.startsWith(prefix + ':')) return true;
  }

  return false;
}
