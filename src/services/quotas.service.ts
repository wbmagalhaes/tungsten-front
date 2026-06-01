import api from './api';

export type QuotaModule = 'files' | 'buckets' | 'jobs' | 'queues' | 'deploys';

export type QuotaKey =
  | 'max_count'
  | 'max_storage_bytes'
  | 'max_executions_per_day'
  | 'max_exec_ms_per_day'
  | 'max_messages_per_day';

export type FlatQuotaKey = `${QuotaModule}:${QuotaKey}`;

export interface QuotaOverride {
  module: QuotaModule;
  key: QuotaKey;
  value: number;
}

export interface UserQuotas {
  effective: Partial<Record<FlatQuotaKey, number>>;
  usage: Partial<Record<FlatQuotaKey, number>>;
  overrides: QuotaOverride[];
}

export const getMyQuotas = async () => {
  const res = await api.get<UserQuotas>('/api/quotas/me');
  return res.data;
};

export const getUserQuotas = async (userId: string) => {
  const res = await api.get<UserQuotas>(`/api/admin/quotas/${userId}`);
  return res.data;
};

export const updateUserQuotas = async (
  userId: string,
  body: Partial<Record<FlatQuotaKey, number>>,
) => {
  const res = await api.patch<UserQuotas>(`/api/admin/quotas/${userId}`, body);
  return res.data;
};

export const deleteUserQuota = async (
  userId: string,
  module: QuotaModule,
  key: QuotaKey,
) => {
  await api.delete(`/api/admin/quotas/${userId}/${module}/${key}`);
};

export const parseFlatKey = (
  flat: string,
): { module: QuotaModule; key: QuotaKey } | null => {
  const [module, key] = flat.split(':') as [QuotaModule, QuotaKey];
  if (!module || !key) return null;
  return { module, key };
};
