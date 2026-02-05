import { Outlet } from 'react-router-dom';

export default function BaseLayout() {
  return (
    <div className='min-h-screen font-sans overflow-x-hidden bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white'>
      <Outlet />
    </div>
  );
}
