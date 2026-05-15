import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createBucket,
  type CreateBucketRequest,
} from '@services/buckets.service';

export const useCreateBucket = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: CreateBucketRequest) => createBucket(req),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['buckets'] }),
  });
};
