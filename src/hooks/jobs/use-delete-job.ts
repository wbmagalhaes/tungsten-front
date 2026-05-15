import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteJob } from '@services/jobs.service';

export const useDeleteJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteJob(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['jobs'] }),
  });
};
