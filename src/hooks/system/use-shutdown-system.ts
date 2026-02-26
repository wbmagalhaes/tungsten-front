import { useMutation } from '@tanstack/react-query';
import { shutdownSystem } from '@services/system.service';

export const useShutdownSystem = () => {
  return useMutation({
    mutationFn: shutdownSystem,
  });
};
