import { useMutation, useQueryClient } from '@tanstack/react-query';
import { retryExecution } from '@services/jobs.service';

export const useRetryExecution = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (executionId: string) => retryExecution(executionId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['jobs'] }),
  });
};
