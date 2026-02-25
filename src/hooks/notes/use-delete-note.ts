import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '@services/notes.service';

export const useDeleteNote = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
    retry: 0,
  });
};
