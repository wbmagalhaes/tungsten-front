import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listUserRecipientsAdmin,
  ensureInappRecipient,
} from '@services/notifications.service';

export const useUserRecipients = (userId: string) =>
  useQuery({
    queryKey: ['admin', 'user-recipients', userId],
    queryFn: () => listUserRecipientsAdmin(userId, { page_size: 100 }),
    enabled: !!userId,
  });

export const useEnsureInapp = (userId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => ensureInappRecipient(userId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['admin', 'user-recipients', userId] }),
  });
};
