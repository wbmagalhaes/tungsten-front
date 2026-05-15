import { useMutation, useQueryClient } from '@tanstack/react-query';
import { runJob } from '@services/jobs.service';

export const useRunJob = (jobId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => runJob(jobId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['jobs', jobId, 'executions'] }),
  });
};
