import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelJob } from '@services/jobs.service';

export const useCancelJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) => cancelJob(jobId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['jobs'] }),
  });
};
