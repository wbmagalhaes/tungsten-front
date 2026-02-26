import { useQuery } from '@tanstack/react-query';
import { listFiles, type ListFilesParams } from '@services/files.service';

export const useListFiles = (params: ListFilesParams) => {
  return useQuery({
    queryKey: ['files', params],
    queryFn: () => listFiles(params),
  });
};
