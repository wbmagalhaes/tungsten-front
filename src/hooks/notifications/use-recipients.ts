import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listRecipients,
  createRecipient,
  updateRecipient,
  deleteRecipient,
  type RecipientKind,
} from '@services/notifications.service';

export const useRecipients = () =>
  useQuery({ queryKey: ['recipients'], queryFn: listRecipients });

export const useCreateRecipient = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { kind: RecipientKind; address: string }) =>
      createRecipient(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['recipients'] }),
  });
};

export const useUpdateRecipient = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, address }: { id: string; address: string }) =>
      updateRecipient(id, { address }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['recipients'] }),
  });
};

export const useDeleteRecipient = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRecipient(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['recipients'] }),
  });
};
