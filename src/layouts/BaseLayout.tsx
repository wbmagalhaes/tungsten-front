import { Outlet } from 'react-router-dom';

export default function BaseLayout() {
  return (
    <div className='min-h-screen flex flex-col bg-gray-50 font-sans overflow-x-hidden'>
      <main className='flex-1 p-4'>
        <Outlet />
      </main>
    </div>
  );
}
