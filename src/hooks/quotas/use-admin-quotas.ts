import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUserQuotas,
  updateUserQuotas,
  deleteUserQuota,
  type QuotaModule,
  type QuotaKey,
  type FlatQuotaKey,
} from '@services/quotas.service';

export const useUserQuotas = (userId: string) =>
  useQuery({
    queryKey: ['quotas', userId],
    queryFn: () => getUserQuotas(userId),
    enabled: !!userId,
  });

export const useUpdateUserQuotas = (userId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<Record<FlatQuotaKey, number>>) =>
      updateUserQuotas(userId, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['quotas', userId] }),
  });
};

export const useDeleteUserQuota = (userId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      module,
      key,
    }: {
      module: QuotaModule;
      key: QuotaKey;
    }) => deleteUserQuota(userId, module, key),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['quotas', userId] }),
  });
};
