import Header from '@components/Header';
import SideBar from '@components/Sidebar';
import { Outlet } from 'react-router-dom';

export default function BaseLayout() {
  return (
    <div className='min-h-screen flex flex-col bg-gray-50 font-sans overflow-x-hidden'>
      <Header />
      <div className='flex flex-1'>
        <SideBar />
        <main className='flex-1 p-4'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
