import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateApiKey,
  type UpdateApiKeyRequest,
} from '@services/api-keys.service';

export const useUpdateApiKey = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: UpdateApiKeyRequest) => updateApiKey(id, req),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['api-keys'] }),
  });
};
