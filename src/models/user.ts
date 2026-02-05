export type User = {
  id: string;
  username: string;
  avatar?: string;
  fullname?: string;
  email?: string;
  scope?: string[];
  is_sudo: boolean;
  created_at: string;
  deleted_at?: string;
};

export function getInitials(user?: User) {
  if (!user) return '';

  const base = user.fullname?.trim() || user.username.trim();
  const parts = base.split(/[\s._-]+/).filter(Boolean);

  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  return base.slice(0, 2).toUpperCase();
}
