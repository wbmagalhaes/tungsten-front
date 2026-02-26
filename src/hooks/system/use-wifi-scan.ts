import { useQuery } from '@tanstack/react-query';
import { wifiScan } from '@services/system.service';

export const useWifiScan = (enabled = false) => {
  return useQuery({
    queryKey: ['system', 'wifi', 'scan'],
    queryFn: wifiScan,
    enabled,
    staleTime: 0,
  });
};
