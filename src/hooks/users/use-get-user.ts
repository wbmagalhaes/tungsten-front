import { getUser } from '@services/users.service';
import { useQuery } from '@tanstack/react-query';

export function useGetUser(id: string, { enabled = true } = {}) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => getUser(id),
    enabled: !!id && enabled,
  });
}
