import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateJob, type UpdateJobRequest } from '@services/jobs.service';

export const useUpdateJob = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: UpdateJobRequest) => updateJob(id, req),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['jobs'] }),
  });
};
