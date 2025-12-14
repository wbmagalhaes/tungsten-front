import { Outlet } from 'react-router-dom';

function Header() {
  return (
    <header className='h-14 flex items-center px-6 border-b bg-white'>
      <h1 className='text-xl font-bold'>Tungsten</h1>
    </header>
  );
}

function SideBar() {
  return (
    <aside className='w-56 shrink-0 border-r bg-white p-4'>
      <nav className='space-y-2 text-sm'>
        <a href='/' className='block font-medium'>
          Dashboard
        </a>
      </nav>
    </aside>
  );
}

export default function BaseLayout() {
  return (
    <div className='min-h-screen flex flex-col bg-gray-50 font-sans'>
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
