import { useQuery } from '@tanstack/react-query';
import { listNotes, type ListNotesParams } from '@services/notes.service';

export const useListNotes = (params?: ListNotesParams) => {
  return useQuery({
    queryKey: ['notes', params],
    queryFn: () => listNotes(params),
  });
};
