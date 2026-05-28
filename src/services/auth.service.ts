import api from './api';

export const login = async (body: LoginRequest) => {
  const res = await api.post<AuthResponse>('/auth/token', body);
  return res.data;
};

export const refreshToken = async () => {
  await api.post('/auth/refresh');
};

export const register = async (body: RegisterRequest) => {
  const res = await api.post<AuthResponse>('/auth/register', body);
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
  await api.post('/auth/switch-sudo', body);
};

export const logout = async () => {
  await api.post('/auth/logout');
};

export const revokeAll = async () => {
  await api.post('/auth/revoke-all');
};

export type LoginRequest = {
  username: string;
  password: string;
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

export type AuthResponse = {
  user_id: string;
};
