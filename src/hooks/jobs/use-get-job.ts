import { getJob } from '@services/jobs.service';
import { useQuery } from '@tanstack/react-query';

export const useGetJob = (id: string, { enabled = true } = {}) => {
  return useQuery({
    queryKey: ['jobs', id],
    queryFn: () => getJob(id),
    enabled: !!id && enabled,
  });
};
