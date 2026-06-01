import { useQuery } from '@tanstack/react-query';
import {
  listProjects,
  type ListProjectsParams,
} from '@services/deploys.service';

export const useListProjects = (params?: ListProjectsParams) =>
  useQuery({
    queryKey: ['deploy-projects', params],
    queryFn: () => listProjects(params),
  });
