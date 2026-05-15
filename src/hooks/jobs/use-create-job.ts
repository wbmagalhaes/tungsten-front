import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createJob, type CreateJobRequest } from '@services/jobs.service';

export const useCreateJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: CreateJobRequest) => createJob(req),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['jobs'] }),
  });
};
