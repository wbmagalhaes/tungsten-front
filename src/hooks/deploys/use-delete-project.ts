import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProject } from '@services/deploys.service';

export const useDeleteProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['deploy-projects'] }),
  });
};
