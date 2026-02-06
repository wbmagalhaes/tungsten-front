import { Link } from 'react-router-dom';
import { Home, LogIn } from 'lucide-react';

interface NotFoundProps {
  isAuthenticated?: boolean;
}

export default function NotFoundPage({ isAuthenticated }: NotFoundProps) {
  return (
    <div className='flex flex-1 items-center justify-center p-6 mt-12'>
      <div className='max-w-xl w-full'>
        <div className='rounded-2xl shadow-xl bg-gray-900/80 border border-gray-800 p-8 text-center backdrop-blur'>
          <h1 className='text-5xl font-extrabold mb-3'>404</h1>
          <p className='text-xl font-semibold mb-2'>Page not found</p>
          <p className='text-gray-400 mb-6'>
            The route you tried to access does not exist or was moved.
          </p>

          <div className='flex gap-3 justify-center flex-wrap'>
            {isAuthenticated ? (
              <Link
                to='/root'
                className='inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-gray-800 hover:bg-gray-700 transition'
              >
                <Home className='h-4 w-4' />
                Back to Init
              </Link>
            ) : (
              <>
                <Link
                  to='/'
                  className='inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-gray-800 hover:bg-gray-700 transition'
                >
                  <Home className='h-4 w-4' />
                  Home
                </Link>
                <Link
                  to='/login'
                  className='inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-gray-800 hover:bg-gray-700 transition'
                >
                  <LogIn className='h-4 w-4' />
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
