import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteFile } from '@services/files.service';

export default function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteFile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list-files'] });
    },
  });
}
