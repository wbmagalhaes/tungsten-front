import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Header from '@components/Header';
import Sidebar from '@components/Sidebar';
import { useAuthStore } from '@stores/useAuthStore';

export default function AuthenticatedLayout() {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    const redirectTo = `/login?cb_url=${encodeURIComponent(
      location.pathname + location.search,
    )}`;

    return <Navigate to={redirectTo} replace />;
  }

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <div className='flex flex-1'>
        <Sidebar />
        <main className='flex-1 p-4'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
