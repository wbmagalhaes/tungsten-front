import { useQuery } from '@tanstack/react-query';
import { listMessages } from '@services/queues.service';

export const useListMessages = (queueId: string) =>
  useQuery({
    queryKey: ['queues', queueId, 'messages'],
    queryFn: () => listMessages(queueId, { page_size: 50 }),
    enabled: !!queueId,
  });
