import { useQuery } from '@tanstack/react-query';
import { listAvailableScopes } from '@services/users.service';

export const useAvailableScopes = () =>
  useQuery({
    queryKey: ['scopes'],
    queryFn: listAvailableScopes,
    staleTime: 5 * 60 * 1000,
  });
