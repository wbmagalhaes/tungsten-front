import { useQuery } from '@tanstack/react-query';
import { listJobs, type ListJobsParams } from '@services/jobs.service';

export const useListJobs = (params?: ListJobsParams) =>
  useQuery({
    queryKey: ['jobs', params],
    queryFn: () => listJobs(params),
    refetchInterval: (query) => {
      const hasActive = query.state.data?.results.some(
        (j) => j.status === 'queued' || j.status === 'running',
      );
      return hasActive ? 3000 : false;
    },
  });
