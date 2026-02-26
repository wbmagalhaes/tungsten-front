import { getNote } from '@services/notes.service';
import { useQuery } from '@tanstack/react-query';

export const useGetNote = (id: string, { enabled = true } = {}) => {
  return useQuery({
    queryKey: ['notes', id],
    queryFn: () => getNote(id),
    enabled: !!id && enabled,
  });
};
