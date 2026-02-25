import { useQuery } from '@tanstack/react-query';
import { shutdownIsScheduled } from '@services/system.service';

const useShutdownIsScheduled = () => {
  return useQuery({
    queryKey: ['system', 'shutdown-is-scheduled'],
    queryFn: shutdownIsScheduled,
    refetchInterval: 30_000,
  });
};

export default useShutdownIsScheduled;
