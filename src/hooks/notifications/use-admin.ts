import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listFailedNotifications,
  retryNotification,
  cancelNotification,
  getCleanupReport,
  runCleanup,
} from '@services/notifications.service';

export const useFailedNotifications = () =>
  useQuery({
    queryKey: ['notifications', 'failed'],
    queryFn: listFailedNotifications,
  });

export const useRetryNotification = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => retryNotification(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
};

export const useCancelNotification = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelNotification(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
};

export const useCleanupReport = () =>
  useQuery({
    queryKey: ['notifications', 'cleanup-report'],
    queryFn: getCleanupReport,
  });

export const useRunCleanup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => runCleanup(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
