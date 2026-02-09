import { useQuery } from '@tanstack/react-query';
import { listServices } from '@services/system.service';

export default function useListServices() {
  return useQuery({
    queryKey: ['system-services'],
    queryFn: listServices,
  });
}
