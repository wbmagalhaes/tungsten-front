import { useQuery } from '@tanstack/react-query';
import { listServices } from '@services/system.service';

export const useListServices = () => {
  return useQuery({
    queryKey: ['system-services'],
    queryFn: listServices,
  });
};
