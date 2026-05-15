import { useQuery } from '@tanstack/react-query';
import {
  listNotifications,
  getNotification,
} from '@services/notifications.service';

export const useNotifications = () =>
  useQuery({
    queryKey: ['notifications'],
    queryFn: listNotifications,
  });

export const useNotification = (id: string) =>
  useQuery({
    queryKey: ['notifications', id],
    queryFn: () => getNotification(id),
    enabled: !!id,
  });
