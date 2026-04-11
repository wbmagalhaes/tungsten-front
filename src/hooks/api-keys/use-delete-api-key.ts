import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteApiKey } from '@services/api-keys.service';

export const useDeleteApiKey = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteApiKey,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['api-keys'] }),
  });
};
