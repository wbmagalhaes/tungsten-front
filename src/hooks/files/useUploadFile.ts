import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadFile, type UploadFileParams } from '@services/files.service';

export default function useUploadFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UploadFileParams) => uploadFile(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list-files'] });
    },
  });
}
