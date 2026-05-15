import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteBucket } from '@services/buckets.service';

export const useDeleteBucket = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBucket(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['buckets'] }),
  });
};
