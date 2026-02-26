import {
  updatePermissions,
  type UpdatePermissionsRequest,
} from '@services/users.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdatePermissions = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: UpdatePermissionsRequest) => updatePermissions(id, req),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users', id] }),
  });
};
