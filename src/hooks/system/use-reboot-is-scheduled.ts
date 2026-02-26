import { useQuery } from '@tanstack/react-query';
import { rebootIsScheduled } from '@services/system.service';

export const useRebootIsScheduled = () => {
  return useQuery({
    queryKey: ['system', 'reboot-is-scheduled'],
    queryFn: rebootIsScheduled,
    refetchInterval: 30_000,
  });
};
