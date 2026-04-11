import api from './api';

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

export async function listApiKeys() {
  const { data } = await api.get<ApiKey[]>('/api/api-keys');
  return data;
}

export async function createApiKey(req: CreateApiKeyRequest) {
  const { data } = await api.post<ApiKeyWithPlaintext>('/api/api-keys', req);
  return data;
}

export async function deleteApiKey(id: string) {
  await api.delete(`/api/api-keys/${id}`);
}
