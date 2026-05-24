import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@hooks/use-online-status';

export function OfflineBanner() {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div className='fixed bottom-0 left-0 right-0 z-1000 bg-yellow-400/90 text-black text-center text-sm py-1 px-3 font-mono flex items-center justify-center gap-2'>
      <WifiOff className='w-4 h-4' />
      no connection: trying to reconnect...
    </div>
  );
}
