import { useQuery } from '@tanstack/react-query';
import { listBuckets, type ListBucketsParams } from '@services/buckets.service';

export const useListBuckets = (params?: ListBucketsParams) =>
  useQuery({
    queryKey: ['buckets', params],
    queryFn: () => listBuckets(params),
  });
