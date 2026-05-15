import { useQuery } from '@tanstack/react-query';
import { getBucket } from '@services/buckets.service';

export const useGetBucket = (id: string) =>
  useQuery({
    queryKey: ['buckets', id],
    queryFn: () => getBucket(id),
    enabled: !!id,
  });
