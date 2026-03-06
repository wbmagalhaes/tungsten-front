import { Outlet } from 'react-router-dom';

export default function BaseLayout() {
  return (
    <div className='min-h-screen font-mono overflow-x-hidden bg-main text-foreground'>
      <Outlet />
    </div>
  );
}
