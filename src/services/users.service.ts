import type { Paginated } from '@models/paginated';
import api from './api';
import type { User } from '@models/user';

export async function listUsers(params: ListUsersParams) {
  const { data } = await api.get<Paginated<User>>('/api/users', {
    params,
  });
  return data;
}

export async function getUser(id: string) {
  const { data } = await api.get<User>(`/api/users/${id}`);
  return data;
}

export async function getProfile() {
  const { data } = await api.get<User>('/api/users/profile');
  return data;
}

export async function createUser(req: CreateUserRequest) {
  const { data } = await api.post<User>('/api/users', req);
  return data;
}

export async function updateUser(id: string, req: UpdateUserRequest) {
  const { data } = await api.patch<User>(`/api/users/${id}`, req);
  return data;
}

export async function deleteUser(id: string) {
  await api.delete(`/api/users/${id}`);
}

export async function updatePermissions(
  id: string,
  req: UpdatePermissionsRequest,
) {
  const { data } = await api.patch<User>(`/api/users/${id}/permissions`, req);
  return data;
}

export async function updateSudo(id: string, req: UpdateSudoRequest) {
  const { data } = await api.patch<User>(`/api/users/${id}/sudo`, req);
  return data;
}

export interface ListUsersParams {
  search?: string;
  page?: number;
  page_size?: number;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  avatar?: string;
  fullname?: string;
  email?: string;
}

export interface UpdateUserRequest {
  avatar?: string;
  fullname?: string;
  email?: string;
}

export interface UpdatePermissionsRequest {
  scope: string[];
}

export interface UpdateSudoRequest {
  is_sudo: boolean;
}
