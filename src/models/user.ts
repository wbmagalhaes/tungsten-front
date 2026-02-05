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
