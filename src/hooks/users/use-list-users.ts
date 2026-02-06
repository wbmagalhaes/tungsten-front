import { listUsers, type ListUsersParams } from '@services/users.service';
import { useQuery } from '@tanstack/react-query';

export function useListUsers(params: ListUsersParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => listUsers(params),
  });
}
