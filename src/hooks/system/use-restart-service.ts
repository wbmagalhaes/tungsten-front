import { useMutation } from '@tanstack/react-query';
import { restartService } from '@services/system.service';

export const useRestartService = () => {
  return useMutation({
    mutationFn: restartService,
  });
};
