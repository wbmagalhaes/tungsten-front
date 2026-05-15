import { useQuery } from '@tanstack/react-query';
import { ping } from '@services/system.service';

export const usePing = () => {
  return useQuery({
    queryKey: ['system-ping'],
    queryFn: ping,
    refetchInterval: 5000,
  });
};
