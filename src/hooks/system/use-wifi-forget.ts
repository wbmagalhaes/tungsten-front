import { useMutation, useQueryClient } from '@tanstack/react-query';
import { wifiForget, type WifiForgetRequest } from '@services/system.service';

export const useWifiForget = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: WifiForgetRequest) => wifiForget(body),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['system', 'wifi', 'scan'] }),
    retry: 0,
  });
};
