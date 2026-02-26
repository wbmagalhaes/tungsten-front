import { useMutation, useQueryClient } from '@tanstack/react-query';
import { wifiConnect, type WifiConnectRequest } from '@services/system.service';

export const useWifiConnect = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: WifiConnectRequest) => wifiConnect(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['system', 'health'] }),
    retry: 0,
  });
};
