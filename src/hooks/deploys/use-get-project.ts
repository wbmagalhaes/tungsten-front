import { useQuery } from '@tanstack/react-query';
import { getProject } from '@services/deploys.service';

export const useGetProject = (id: string) =>
  useQuery({
    queryKey: ['deploy-projects', id],
    queryFn: () => getProject(id),
    enabled: !!id,
  });
