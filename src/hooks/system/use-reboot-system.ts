import { useMutation } from '@tanstack/react-query';
import { rebootSystem } from '@services/system.service';

export default function useRebootSystem() {
  return useMutation({
    mutationFn: rebootSystem,
  });
}
