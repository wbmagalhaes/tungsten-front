import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

interface Navigator {
  standalone?: boolean;
}

function detectIOS() {
  if (typeof navigator === 'undefined') return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function detectStandaloneIOS() {
  if (typeof navigator === 'undefined') return false;
  return (navigator as Navigator).standalone === true;
}

function detectStandalone() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches;
}

export function usePwaInstall() {
  const [promptEvent, setPromptEvent] =
    useState<BeforeInstallPromptEvent | null>(null);

  const isIOS = detectIOS();
  const isIOSStandalone = detectStandaloneIOS();
  const isStandalone = detectStandalone();

  useEffect(() => {
    const handler = (e: Event) => {
      const evt = e as BeforeInstallPromptEvent;
      evt.preventDefault();
      setPromptEvent(evt);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = async () => {
    if (!promptEvent) return;

    await promptEvent.prompt();
    await promptEvent.userChoice;

    setPromptEvent(null);
  };

  return {
    canInstall: !!promptEvent && !isStandalone,
    install,
    needsInstructions: isIOS && !isIOSStandalone,
  };
}

// import { usePwaInstall } from '@hooks/use-pwa-install';

// export function InstallPwaButton() {
//   const { canInstall, install, needsInstructions } = usePwaInstall();

//   if (canInstall) {
//     return (
//       <button
//         onClick={install}
//         className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700"
//       >
//         Instalar app
//       </button>
//     );
//   }

//   if (needsInstructions) {
//     return (
//       <div className="text-sm opacity-80">
//         No iOS: Compartilhar → Adicionar à Tela de Início
//       </div>
//     );
//   }

//   return null;
// }
