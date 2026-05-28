import { useMutation, useQueryClient } from '@tanstack/react-query';
import { revokeSession } from '@services/sessions.service';

export const useRevokeSession = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => revokeSession(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['auth', 'sessions'] }),
  });
};
