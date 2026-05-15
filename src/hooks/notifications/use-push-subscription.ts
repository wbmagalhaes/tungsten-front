import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getVapidPublicKey,
  createRecipient,
} from '@services/notifications.service';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const b64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(b64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

export const isPushSupported = () =>
  typeof window !== 'undefined' &&
  'serviceWorker' in navigator &&
  'PushManager' in window;

export const useEnablePushSubscription = () => {
  const qc = useQueryClient();
  const [stage, setStage] = useState<
    'idle' | 'permission' | 'subscribing' | 'registering'
  >('idle');

  const mutation = useMutation({
    mutationFn: async () => {
      if (!isPushSupported()) {
        throw new Error('Push notifications are not supported in this browser');
      }

      setStage('permission');
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission denied');
      }

      setStage('subscribing');

      const existing = await navigator.serviceWorker.getRegistration();
      if (!existing) {
        throw new Error(
          'No service worker registered. Push only works on the installed PWA / production build.',
        );
      }

      const reg = await Promise.race([
        navigator.serviceWorker.ready,
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error('Service worker activation timed out')),
            8000,
          ),
        ),
      ]);
      const { public_key } = await getVapidPublicKey();
      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(public_key),
        });
      }

      setStage('registering');
      return createRecipient({
        kind: 'push',
        address: JSON.stringify(sub.toJSON()),
      });
    },
    onSettled: () => {
      setStage('idle');
      qc.invalidateQueries({ queryKey: ['recipients'] });
    },
  });

  return { ...mutation, stage };
};
