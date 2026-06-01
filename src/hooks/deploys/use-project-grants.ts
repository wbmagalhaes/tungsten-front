import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listProjectGrants,
  createProjectGrant,
  deleteProjectGrant,
  type CreateGrantRequest,
  type GrantPermission,
} from '@services/deploys.service';

export const useProjectGrants = (id: string) =>
  useQuery({
    queryKey: ['deploy-projects', id, 'grants'],
    queryFn: () => listProjectGrants(id, { page_size: 100 }),
    enabled: !!id,
  });

export const useCreateProjectGrant = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (grant: CreateGrantRequest) => createProjectGrant(id, grant),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['deploy-projects', id, 'grants'] }),
  });
};

export const useDeleteProjectGrant = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      permission,
    }: {
      userId: string;
      permission: GrantPermission;
    }) => deleteProjectGrant(id, userId, permission),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['deploy-projects', id, 'grants'] }),
  });
};
