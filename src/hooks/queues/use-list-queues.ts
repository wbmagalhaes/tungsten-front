import { useQuery } from '@tanstack/react-query';
import { listQueues, type ListQueuesParams } from '@services/queues.service';

export const useListQueues = (params?: ListQueuesParams) =>
  useQuery({
    queryKey: ['queues', params],
    queryFn: () => listQueues(params),
  });
