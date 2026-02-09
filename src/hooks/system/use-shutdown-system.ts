import { useMutation } from '@tanstack/react-query';
import { shutdownSystem } from '@services/system.service';

export default function useShutdownSystem() {
  return useMutation({
    mutationFn: shutdownSystem,
  });
}
