import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote, type CreateNoteRequest } from '@services/notes.service';

export const useCreateNote = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateNoteRequest) => createNote(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
    retry: 0,
  });
};
