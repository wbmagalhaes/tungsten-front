import { useQuery } from '@tanstack/react-query';
import { healthCheck } from '../services/health-check.service';

export default function useHealthCheck() {
  return useQuery({
    queryKey: ['health-check'],
    queryFn: healthCheck,
  });
}
