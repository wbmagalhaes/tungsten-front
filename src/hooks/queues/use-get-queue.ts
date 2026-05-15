import { useQuery } from '@tanstack/react-query';
import { getQueue } from '@services/queues.service';

export const useGetQueue = (id: string) =>
  useQuery({
    queryKey: ['queues', id],
    queryFn: () => getQueue(id),
    enabled: !!id,
  });
