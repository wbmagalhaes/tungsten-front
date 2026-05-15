import { useQuery } from '@tanstack/react-query';
import {
  listJobExecutions,
  type ListExecutionsParams,
} from '@services/jobs.service';

export const useListExecutions = (jobId: string, params?: ListExecutionsParams) =>
  useQuery({
    queryKey: ['jobs', jobId, 'executions', params],
    queryFn: () => listJobExecutions(jobId, params),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const hasActive = query.state.data?.results.some(
        (e) => e.status === 'queued' || e.status === 'running',
      );
      return hasActive ? 3000 : false;
    },
  });
