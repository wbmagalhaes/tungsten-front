import { useQuery } from '@tanstack/react-query';
import { listFailedEvents } from '@services/events.service';

export const useFailedEvents = () =>
  useQuery({
    queryKey: ['events', 'failed'],
    queryFn: listFailedEvents,
  });
