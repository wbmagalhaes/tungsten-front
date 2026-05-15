import { useQuery } from '@tanstack/react-query';
import { getTopic } from '@services/notifications.service';

export const useGetTopic = (id: string) =>
  useQuery({
    queryKey: ['topics', id],
    queryFn: () => getTopic(id),
    enabled: !!id,
  });
