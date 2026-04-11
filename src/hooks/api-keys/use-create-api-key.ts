import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createApiKey } from '@services/api-keys.service';

export const useCreateApiKey = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createApiKey,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['api-keys'] }),
  });
};
