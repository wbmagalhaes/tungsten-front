import { useQuery } from '@tanstack/react-query';
import { listSessions } from '@services/sessions.service';

export const useSessions = () =>
  useQuery({
    queryKey: ['auth', 'sessions'],
    queryFn: listSessions,
  });
