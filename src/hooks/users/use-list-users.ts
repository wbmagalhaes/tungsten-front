import { listUsers, type ListUsersParams } from '@services/users.service';
import { useQuery } from '@tanstack/react-query';

export const useListUsers = (params: ListUsersParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => listUsers(params),
  });
};
