import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getNotificationPreferences,
  updateNotificationPreferences,
  type NotificationPreferences,
} from '@services/notifications.service';

const KEY = ['notification-preferences'];

export const useNotificationPreferences = () =>
  useQuery({ queryKey: KEY, queryFn: getNotificationPreferences });

export const useUpdateNotificationPreferences = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateNotificationPreferences,
    onSuccess: (data) => {
      qc.setQueryData<NotificationPreferences>(KEY, data);
      qc.invalidateQueries({ queryKey: ['recipients'] });
    },
  });
};
