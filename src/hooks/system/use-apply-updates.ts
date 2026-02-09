import { useMutation } from '@tanstack/react-query';
import { applyUpdates } from '@services/system.service';

export default function useApplyUpdates() {
  return useMutation({
    mutationFn: applyUpdates,
  });
}
