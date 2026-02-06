import { updateUser, type UpdateUserRequest } from '@services/users.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateUser(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: UpdateUserRequest) => updateUser(id, req),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      qc.invalidateQueries({ queryKey: ['users', id] });
    },
  });
}
