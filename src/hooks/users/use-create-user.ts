import { createUser } from '@services/users.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}
