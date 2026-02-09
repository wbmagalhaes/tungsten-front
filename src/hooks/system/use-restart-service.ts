import { useMutation } from '@tanstack/react-query';
import { restartService } from '@services/system.service';

export default function useRestartService() {
  return useMutation({
    mutationFn: restartService,
  });
}
