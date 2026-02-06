import { useAuthStore } from '@stores/useAuthStore';
import { Outlet, useNavigate } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className='min-h-screen flex flex-col'>
      <PublicHeader />
      <main className='flex-1'>
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}

function PublicHeader() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  return (
    <header className='container mx-auto px-4 py-6 flex justify-between items-center'>
      <div
        className='flex items-center gap-3 cursor-pointer'
        onClick={() => navigate('/')}
      >
        <div className='relative w-12 h-12 bg-linear-to-br from-blue-600 to-purple-600 rounded-sm flex items-center justify-center'>
          <span className='text-white font-bold text-2xl'>W</span>
          <span className='absolute top-0.5 right-1 text-white text-[10px] font-bold font-mono'>
            74
          </span>
        </div>
        <span className='text-2xl font-bold text-white'>Tungsten</span>
      </div>

      {isAuthenticated ? (
        <button
          onClick={() => navigate('/root')}
          className='px-6 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-sm font-semibold'
        >
          Dashboard
        </button>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className='px-6 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-sm font-semibold'
        >
          Login
        </button>
      )}
    </header>
  );
}

function PublicFooter() {
  return (
    <footer className='container mx-auto px-4 py-4 mt-20 border-t border-gray-700'>
      <div className='text-start text-gray-400'>
        <p>&copy; 2026 tungsten</p>
      </div>
    </footer>
  );
}
