import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listQueueGrants,
  createQueueGrant,
  deleteQueueGrant,
} from '@services/queues.service';

export const useQueueGrants = (id: string) =>
  useQuery({
    queryKey: ['queues', id, 'grants'],
    queryFn: () => listQueueGrants(id, { page_size: 100 }),
    enabled: !!id,
  });

export const useCreateQueueGrant = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (grant: { user_id: string; permission: string }) =>
      createQueueGrant(id, grant),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['queues', id, 'grants'] }),
  });
};

export const useDeleteQueueGrant = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      permission,
    }: {
      userId: string;
      permission: string;
    }) => deleteQueueGrant(id, userId, permission),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['queues', id, 'grants'] }),
  });
};
