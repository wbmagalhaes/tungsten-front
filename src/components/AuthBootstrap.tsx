import { useEffect, useRef } from 'react';
import { getProfile } from '@services/profile.service';
import { useAuthStore } from '@stores/useAuthStore';

export default function AuthBootstrap() {
  const status = useAuthStore((s) => s.status);
  const sudoActive = useAuthStore((s) => s.isSudo);
  const accessExpiresAt = useAuthStore((s) => s.user?.access_expires_at);
  const setUser = useAuthStore((s) => s.setUser);
  const setAnon = useAuthStore((s) => s.setAnon);
  const setSudoExpired = useAuthStore((s) => s.setSudoExpired);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    if (status !== 'unknown') return;
    ran.current = true;

    getProfile().then(setUser).catch(setAnon);
  }, [status, setUser, setAnon]);

  useEffect(() => {
    if (!sudoActive || !accessExpiresAt) return;
    const msLeft = accessExpiresAt * 1000 - Date.now();
    if (msLeft <= 0) {
      setSudoExpired();
      getProfile()
        .then(setUser)
        .catch(() => {});
      return;
    }
    const t = setTimeout(() => {
      setSudoExpired();
      getProfile()
        .then(setUser)
        .catch(() => {});
    }, msLeft);
    return () => clearTimeout(t);
  }, [sudoActive, accessExpiresAt, setSudoExpired, setUser]);

  return null;
}
