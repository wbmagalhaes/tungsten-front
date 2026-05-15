import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelExecution } from '@services/jobs.service';

export const useCancelExecution = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (executionId: string) => cancelExecution(executionId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['jobs'] }),
  });
};
