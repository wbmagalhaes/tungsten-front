import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  verifyRecipient,
  setRecipientDisabled,
  rotateRecipientSecret,
} from '@services/notifications.service';

export const useVerifyRecipient = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, code }: { id: string; code?: string }) =>
      verifyRecipient(id, code),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['recipients'] }),
  });
};

export const useSetRecipientDisabled = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, disabled }: { id: string; disabled: boolean }) =>
      setRecipientDisabled(id, disabled),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['recipients'] }),
  });
};

export const useRotateRecipientSecret = () =>
  useMutation({
    mutationFn: (id: string) => rotateRecipientSecret(id),
  });
