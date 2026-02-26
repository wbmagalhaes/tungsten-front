import { useMutation, useQueryClient } from '@tanstack/react-query';
import { applyUpdates } from '@services/system.service';

export const useApplyUpdates = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: applyUpdates,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['system-updates'] });
    },
  });
};
