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
        isSudo && 'border-4 border-destructive rounded-xl',
      )}
    >
      <Header />
      <div className='flex flex-1 mt-12'>
        <Sidebar />
        <main className='flex-1 p-4'>
          <Outlet />
        </main>
      </div>

      {isSudo && (
        <>
          <span
            className={cn(
              'fixed top-0 left-0 w-0 h-0 border-solid border-6 z-9999',
              'border-t-destructive border-l-destructive border-r-transparent border-b-transparent',
            )}
          />
          <span
            className={cn(
              'fixed top-0 right-0 w-0 h-0 border-solid border-6 z-9999',
              'border-t-destructive border-r-destructive border-l-transparent border-b-transparent',
            )}
          />
          <span
            className={cn(
              'fixed bottom-0 left-0 w-0 h-0 border-solid border-6 z-9999',
              'border-b-destructive border-l-destructive border-t-transparent border-r-transparent',
            )}
          />
          <span
            className={cn(
              'fixed bottom-0 right-0 w-0 h-0 border-solid border-6 z-9999',
              'border-b-destructive border-r-destructive border-t-transparent border-l-transparent',
            )}
          />

          <div className='fixed inset-0 border-4 border-destructive flex z-9999 rounded-xl pointer-events-none'>
            <div className='bg-destructive text-foreground text-center pb-1 px-2 rounded-b-sm mx-auto mb-auto font-bold text-xs uppercase tracking-wide'>
              Sudo Mode
            </div>
          </div>
        </>
      )}
    </div>
  );
}
