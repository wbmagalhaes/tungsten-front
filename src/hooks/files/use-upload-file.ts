import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadFile, type UploadFileParams } from '@services/files.service';

export const useUploadFile = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (params: UploadFileParams) => uploadFile(params),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['files'] });
    },
  });
};
