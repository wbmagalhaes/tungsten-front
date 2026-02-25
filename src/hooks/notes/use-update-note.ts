import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateNote, type UpdateNoteRequest } from '@services/notes.service';

export const useUpdateNote = (noteId: string) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateNoteRequest) => updateNote(noteId, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
    retry: 0,
  });
};
