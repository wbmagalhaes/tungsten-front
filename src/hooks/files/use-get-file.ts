import { readFile } from '@services/files.service';
import { useQuery } from '@tanstack/react-query';

export const useGetFile = (id: string, { enabled = true } = {}) => {
  return useQuery({
    queryKey: ['files', id],
    queryFn: () => readFile(id),
    enabled: !!id && enabled,
  });
};
