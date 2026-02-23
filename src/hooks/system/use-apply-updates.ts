import { useMutation, useQueryClient } from '@tanstack/react-query';
import { applyUpdates } from '@services/system.service';

export default function useApplyUpdates() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: applyUpdates,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-updates'] });
    },
  });
}
