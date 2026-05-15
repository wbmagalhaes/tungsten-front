import { useQuery } from '@tanstack/react-query';
import {
  listFailedExecutions,
  type ListExecutionsParams,
} from '@services/jobs.service';

export const useFailedExecutions = (params?: ListExecutionsParams) =>
  useQuery({
    queryKey: ['jobs', 'failed-executions', params],
    queryFn: () => listFailedExecutions(params),
  });
