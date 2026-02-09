import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '@hooks/auth/use-login';
import { Turnstile } from '@marsidev/react-turnstile';
import { LogIn, User, Lock, AlertCircle, EyeOff, Eye, Dot } from 'lucide-react';
import { Card, CardContent } from '@components/base/card';
import { Button } from '@components/base/button';
import { TextField } from '@components/base/text-field';

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const { mutateAsync, isPending, error, isError } = useLogin();

  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutateAsync({ username, password, token });
    const params = new URLSearchParams(location.search);
    const cbUrl = params.get('cb_url');
    navigate(cbUrl || '/root', { replace: true });
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
    inputRef.current?.focus();
  };

  return (
    <div className='min-h-screen flex justify-center p-4 mt-8 md:mt-32'>
      <div className='w-full max-w-md space-y-4'>
        <Card>
          <CardContent className='p-6'>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <TextField
                id='username'
                label='Username'
                icon={<User className='w-4 h-4' />}
                type='text'
                placeholder='Enter your username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <div>
                <label
                  className='text-sm text-gray-400 mb-2 flex items-center gap-2'
                  htmlFor='password'
                >
                  <Lock className='w-4 h-4' />
                  Password
                </label>
                <div className='flex items-center bg-gray-900 border border-gray-700 rounded-lg focus-within:ring-2 focus-within:ring-blue-600'>
                  <input
                    id='password'
                    ref={inputRef}
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Enter your password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='w-full flex-1 p-3 bg-transparent border-none text-gray-200 placeholder-gray-500 focus:outline-none rounded-l-lg'
                    required
                  />
                  <button
                    type='button'
                    onClick={toggleShowPassword}
                    className='flex items-center justify-center p-3 text-gray-200 hover:text-white hover:bg-gray-800 transition-colors rounded-r-lg border-l border-gray-700'
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className='w-6 h-6' />
                    ) : (
                      <Eye className='w-6 h-6' />
                    )}
                  </button>
                </div>
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
                  className='max-w-full w-full'
                  siteKey={SITE_KEY}
                  onSuccess={(t) => setToken(t)}
                  options={{
                    theme: 'dark',
                    language: 'en',
                    appearance: 'interaction-only',
                  }}
                />

                <Button
                  type='submit'
                  disabled={isPending || !token}
                  className='w-full'
                >
                  <LogIn className='w-4 h-4' />
                  {isPending ? 'Signing in...' : 'Sign In'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className='text-sm text-gray-500 flex gap-1 justify-center'>
          <span>Tungsten Server</span>
          <Dot />
          <span>Personal Self-Hosted</span>
        </p>
      </div>
    </div>
  );
}
