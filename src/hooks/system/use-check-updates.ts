import { useQuery } from '@tanstack/react-query';
import { checkUpdates } from '@services/system.service';

export const useCheckUpdates = () => {
  return useQuery({
    queryKey: ['system-updates'],
    queryFn: checkUpdates,
  });
};
