import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '@hooks/auth/use-login';
import { Turnstile } from '@marsidev/react-turnstile';
import { LogIn, User, Lock, AlertCircle } from 'lucide-react';

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const { mutateAsync, isPending, error, isError } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutateAsync({ username, password, token });
    const params = new URLSearchParams(location.search);
    const cbUrl = params.get('cb_url');
    navigate(cbUrl || '/root', { replace: true });
  };

  return (
    <div className='min-h-screen flex justify-center p-4 mt-8 md:mt-32'>
      <div className='w-full max-w-md space-y-6'>
        <div className='bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='text-sm text-gray-400 mb-2 flex items-center gap-2'>
                <User className='w-4 h-4' />
                Username
              </label>
              <input
                type='text'
                placeholder='Enter your username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className='w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600'
                required
              />
            </div>

            <div>
              <label className='text-sm text-gray-400 mb-2 flex items-center gap-2'>
                <Lock className='w-4 h-4' />
                Password
              </label>
              <input
                type='password'
                placeholder='Enter your password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600'
                required
              />
            </div>

            {isError && (
              <div className='p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm flex items-start gap-2'>
                <AlertCircle className='w-4 h-4 mt-0.5 shrink-0' />
                <span>{error.message}</span>
              </div>
            )}

            <div className='flex flex-col gap-4 justify-center'>
              <Turnstile
                as='aside'
                siteKey={SITE_KEY}
                onSuccess={(t) => setToken(t)}
                options={{
                  theme: 'dark',
                  language: 'en',
                  appearance: 'interaction-only',
                }}
              />

              <button
                type='submit'
                disabled={isPending || !token}
                className='w-full px-4 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <LogIn className='w-4 h-4' />
                {isPending ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>

        <p className='text-center text-sm text-gray-500'>
          Tungsten Server • Personal Self-Hosted
        </p>
      </div>
    </div>
  );
}
