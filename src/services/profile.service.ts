import api from './api';
import type { User } from '@models/user';

export const getProfile = async () => {
  const res = await api.get<User>('/api/me');
  return res.data;
};

export const updateProfile = async (params: UpdateProfileRequest) => {
  const res = await api.patch<User>('/api/me', params);
  return res.data;
};

export type UpdateProfileRequest = {
  fullname?: string;
  email?: string;
  avatar?: string;
};
