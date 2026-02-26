import { deleteUser } from '@services/users.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
};
