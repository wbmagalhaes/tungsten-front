import { useQuery } from '@tanstack/react-query';
import { listFiles, type ListFilesParams } from '@services/files.service';

export default function useListFiles(params: ListFilesParams) {
  return useQuery({
    queryKey: ['list-files', params],
    queryFn: () => listFiles(params),
  });
}
