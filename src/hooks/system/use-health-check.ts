import { useQuery } from '@tanstack/react-query';
import { healthCheck } from '@services/system.service';

export default function useHealthCheck() {
  return useQuery({
    queryKey: ['system-health'],
    queryFn: healthCheck,
    refetchInterval: 5000,
  });
}
