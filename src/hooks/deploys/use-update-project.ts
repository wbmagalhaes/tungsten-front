import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateProject,
  type UpdateProjectRequest,
} from '@services/deploys.service';

export const useUpdateProject = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: UpdateProjectRequest) => updateProject(id, req),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['deploy-projects'] });
      qc.invalidateQueries({ queryKey: ['deploy-projects', id] });
    },
  });
};
