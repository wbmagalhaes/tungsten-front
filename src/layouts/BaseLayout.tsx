import { Outlet } from 'react-router-dom';
import { OfflineBanner } from '@components/OfflineBanner';

export default function BaseLayout() {
  return (
    <div className='min-h-screen font-mono overflow-x-hidden bg-main text-main-fg'>
      <OfflineBanner />
      <Outlet />
    </div>
  );
}
