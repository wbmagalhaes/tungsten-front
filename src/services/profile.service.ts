import api from './api';
import type { User } from '@models/user';

export const profile = async () => {
  const res = await api.get<User>('/api/me');
  return res.data;
};
