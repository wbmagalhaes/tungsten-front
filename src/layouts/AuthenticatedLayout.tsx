import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Header from '@components/Header';
import Sidebar from '@components/Sidebar';
import { useAuthStore } from '@stores/useAuthStore';
import { cn } from '@utils/cn';

export default function AuthenticatedLayout() {
  const { isAuthenticated, isSudo } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    const redirectTo = `/login?cb_url=${encodeURIComponent(
      location.pathname + location.search,
    )}`;

    return <Navigate to={redirectTo} replace />;
  }

  return (
    <div
      className={cn(
        'min-h-screen flex flex-col',
        isSudo && 'border-4 border-red-500',
      )}
    >
      <Header />
      <div className='flex flex-1'>
        <Sidebar />
        <main className='flex-1 p-4'>
          <Outlet />
        </main>
      </div>

      {isSudo && (
        <div className='fixed inset-0 border-4 border-red-500 flex z-9999 pointer-events-none'>
          <div className='bg-red-500 text-white text-center pb-1 px-2 rounded-b-sm mx-auto mb-auto font-bold text-xs uppercase tracking-wide'>
            Sudo Mode
          </div>
        </div>
      )}
    </div>
  );
}
