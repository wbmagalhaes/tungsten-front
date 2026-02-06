import { Link } from 'react-router-dom';
import { ShieldBan, Home, User2 } from 'lucide-react';

export default function AccessDeniedPage() {
  return (
    <div className='flex flex-1 items-center justify-center p-6 mt-12'>
      <div className='max-w-xl w-full'>
        <div className='rounded-2xl shadow-xl bg-gray-900/80 border border-gray-800 p-8 text-center backdrop-blur'>
          <div className='flex justify-center mb-4'>
            <ShieldBan className='h-14 w-14' />
          </div>

          <h1 className='text-3xl font-bold mb-2'>403 - Access denied</h1>
          <p className='text-gray-400 mb-6'>
            You do not have permission to access this page.
          </p>

          <div className='flex gap-3 justify-center'>
            <Link
              to='/root'
              className='inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-gray-800 hover:bg-gray-700 transition'
            >
              <Home className='h-4 w-4' />
              Back to Init
            </Link>

            <Link
              to='/profile'
              className='inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-gray-800 hover:bg-gray-700 transition'
            >
              <User2 className='h-4 w-4' />
              Your profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
