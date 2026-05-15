import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateBucket,
  type UpdateBucketRequest,
} from '@services/buckets.service';

export const useUpdateBucket = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: UpdateBucketRequest) => updateBucket(id, req),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['buckets'] }),
  });
};
