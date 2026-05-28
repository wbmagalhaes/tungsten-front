import api from './api';
import type { Session } from '@models/session';

export const listSessions = async () => {
  const res = await api.get<Session[]>('/auth/sessions');
  return res.data;
};

export const revokeSession = async (id: string) => {
  await api.delete(`/auth/sessions/${id}`);
};
