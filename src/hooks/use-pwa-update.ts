import { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

export function usePwaUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateServiceWorker, setUpdateServiceWorker] = useState<
    (() => void) | null
  >(null);

  useEffect(() => {
    const updateSW = registerSW({
      onNeedRefresh() {
        setUpdateAvailable(true);
        setUpdateServiceWorker(() => updateSW);
      },
      onOfflineReady() {
        console.log('app ready to work offline');
      },
    });
  }, []);

  const update = () => {
    if (updateServiceWorker) {
      updateServiceWorker();
      window.location.reload();
    }
  };

  return { updateAvailable, update };
}
