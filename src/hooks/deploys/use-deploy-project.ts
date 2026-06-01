import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deployProject, type DeployParams } from '@services/deploys.service';

export const useDeployProject = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: DeployParams) => deployProject(id, params),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['deploy-projects'] });
      qc.invalidateQueries({ queryKey: ['deploy-projects', id] });
      qc.invalidateQueries({ queryKey: ['quotas', 'me'] });
    },
  });
};
