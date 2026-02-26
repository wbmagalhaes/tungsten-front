import { updateSudo, type UpdateSudoRequest } from '@services/users.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateSudo = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: UpdateSudoRequest) => updateSudo(id, req),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users', id] }),
  });
};
