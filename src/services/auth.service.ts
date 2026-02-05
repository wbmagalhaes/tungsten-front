import api from './api';

export const login = async (body: LoginRequest) => {
  const res = await api.post<TokenPair>('/auth/token', body);
  return res.data;
};

export const refreshToken = async (body: RefreshRequest) => {
  const res = await api.post<TokenPair>('/auth/refresh', body);
  return res.data;
};

export const switchSudo = async () => {
  const res = await api.post<TokenPair>('/auth/switch-sudo');
  return res.data;
};

export const logout = async () => {
  const res = await api.post('/auth/logout');
  return res.data;
};

export const revokeAll = async () => {
  const res = await api.post('/auth/revoke-all');
  return res.data;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type RefreshRequest = {
  token: string;
};

export type TokenPair = {
  access: string;
  refresh: string;
};
