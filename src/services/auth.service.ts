import api from './api';

export const login = async (body: LoginRequest) => {
  const res = await api.post<TokenPair>('/auth/token', body);
  return res.data;
};

export const refreshToken = async (body: RefreshRequest) => {
  const res = await api.post<TokenPair>('/auth/refresh', body);
  return res.data;
};

export const register = async (body: RegisterRequest) => {
  const res = await api.post<TokenPair>('/auth/register', body);
  return res.data;
};

export const changePassword = async (body: ChangePasswordRequest) => {
  await api.post('/auth/change-password', body);
};

export const recoverPassword = async (body: RecoverPasswordRequest) => {
  await api.post('/auth/recover-password', body);
};

export const resetPassword = async (body: ResetPasswordRequest) => {
  await api.post('/auth/password-reset', body);
};

export const forceSetPassword = async (
  userId: string,
  body: ForceSetPasswordRequest,
) => {
  await api.post(`/api/users/${userId}/set-password`, body);
};

export const switchSudo = async (body: SudoRequest) => {
  const res = await api.post<TokenPair>('/auth/switch-sudo', body);
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
  token: string;
};

export type RefreshRequest = {
  token: string;
};

export interface RegisterRequest {
  username: string;
  password: string;
  token: string;
  invite_code?: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface RecoverPasswordRequest {
  email: string;
  token: string;
}

export interface ResetPasswordRequest {
  reset_token: string;
  new_password: string;
}

export interface ForceSetPasswordRequest {
  new_password: string;
}

export type SudoRequest = {
  password: string;
};

export type TokenPair = {
  access: string;
  refresh: string;
};
