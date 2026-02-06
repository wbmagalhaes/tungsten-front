import { deleteUser } from '@services/users.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}
