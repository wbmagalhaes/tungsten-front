import { useMutation, useQueryClient } from '@tanstack/react-query';
import { retryJob } from '@services/jobs.service';

export const useRetryJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) => retryJob(jobId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['jobs'] }),
  });
};
