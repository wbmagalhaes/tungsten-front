import { useQuery } from '@tanstack/react-query';
import { listFiles, type ListFilesParams } from '@services/files.service';

export const useListFiles = (bucketId: string, params: ListFilesParams = {}) => {
  return useQuery({
    queryKey: ['files', bucketId, params],
    queryFn: () => listFiles(bucketId, params),
    enabled: !!bucketId,
  });
};
