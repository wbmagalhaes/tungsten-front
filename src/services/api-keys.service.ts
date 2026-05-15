import api from './api';
import type { Paginated } from '@models/paginated';

export type ApiKey = {
  id: string;
  name: string;
  scope: string[];
  expires_at?: string;
  created_at: string;
  last_used_at?: string;
};

export type ApiKeyWithPlaintext = ApiKey & {
  plaintext: string;
};

export type CreateApiKeyRequest = {
  name: string;
  scope: string[];
  expires_at?: string;
};

export type UpdateApiKeyRequest = {
  scope: string[];
};

export interface ListApiKeysParams {
  page?: number;
  page_size?: number;
}

export async function listApiKeys(params?: ListApiKeysParams) {
  const { data } = await api.get<Paginated<ApiKey>>('/api/api-keys', {
    params,
  });
  return data;
}

export async function createApiKey(req: CreateApiKeyRequest) {
  const { data } = await api.post<ApiKeyWithPlaintext>('/api/api-keys', req);
  return data;
}

export async function updateApiKey(id: string, req: UpdateApiKeyRequest) {
  const { data } = await api.patch<ApiKey>(`/api/api-keys/${id}`, req);
  return data;
}

export async function deleteApiKey(id: string) {
  await api.delete(`/api/api-keys/${id}`);
}
