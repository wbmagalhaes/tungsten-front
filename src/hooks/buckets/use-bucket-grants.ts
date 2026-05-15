import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listBucketGrants,
  createBucketGrant,
  deleteBucketGrant,
  type BucketGrant,
} from '@services/buckets.service';

export const useBucketGrants = (id: string) =>
  useQuery({
    queryKey: ['buckets', id, 'grants'],
    queryFn: () => listBucketGrants(id, { page_size: 100 }),
    enabled: !!id,
  });

export const useCreateBucketGrant = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (grant: BucketGrant) => createBucketGrant(id, grant),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['buckets', id, 'grants'] }),
  });
};

export const useDeleteBucketGrant = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      permission,
    }: {
      userId: string;
      permission: string;
    }) => deleteBucketGrant(id, userId, permission),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['buckets', id, 'grants'] }),
  });
};
