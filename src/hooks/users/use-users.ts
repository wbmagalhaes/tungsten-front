import {
  list,
  get,
  create,
  update,
  remove,
  updatePermissions,
  updateSudo,
  type ListUsersParams,
  type UpdatePermissionsRequest,
  type UpdateSudoRequest,
  type UpdateUserRequest,
} from '@services/users.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useUsers(params: ListUsersParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => list(params),
  });
}

export function useUser(id: string, { enabled = true } = {}) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => get(id),
    enabled: !!id && enabled,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useUpdateUser(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: UpdateUserRequest) => update(id, req),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      qc.invalidateQueries({ queryKey: ['users', id] });
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useUpdatePermissions(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: UpdatePermissionsRequest) => updatePermissions(id, req),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users', id] }),
  });
}

export function useUpdateSudo(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: UpdateSudoRequest) => updateSudo(id, req),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users', id] }),
  });
}
