import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createProject,
  type CreateProjectRequest,
} from '@services/deploys.service';

export const useCreateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: CreateProjectRequest) => createProject(req),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['deploy-projects'] }),
  });
};
