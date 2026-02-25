import { useQuery } from '@tanstack/react-query';
import { rebootIsScheduled } from '@services/system.service';

const useRebootIsScheduled = () => {
  return useQuery({
    queryKey: ['system', 'reboot-is-scheduled'],
    queryFn: rebootIsScheduled,
    refetchInterval: 30_000,
  });
};

export default useRebootIsScheduled;
