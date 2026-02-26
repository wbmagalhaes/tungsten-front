import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteFile } from '@services/files.service';

export const useDeleteFile = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteFile(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['files'] });
    },
  });
};
