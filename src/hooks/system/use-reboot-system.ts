import { useMutation } from '@tanstack/react-query';
import { rebootSystem } from '@services/system.service';

export const useRebootSystem = () => {
  return useMutation({
    mutationFn: rebootSystem,
  });
};
