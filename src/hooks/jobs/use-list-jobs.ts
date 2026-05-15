import { useQuery } from '@tanstack/react-query';
import { listJobs, type ListJobsParams } from '@services/jobs.service';

export const useListJobs = (params?: ListJobsParams) =>
  useQuery({
    queryKey: ['jobs', params],
    queryFn: () => listJobs(params),
  });
