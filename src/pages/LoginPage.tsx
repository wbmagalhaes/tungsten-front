import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '@hooks/auth/use-login';
import { Turnstile } from '@marsidev/react-turnstile';
import { LogIn, User, Lock, AlertCircle, Dot } from 'lucide-react';
import { Card, CardContent } from '@components/base/card';
import { Button } from '@components/base/button';
import { TextField } from '@components/base/text-field';
import { PasswordField } from '@components/base/password-field';

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

              <PasswordField
                id='password'
                label='Password'
                icon={<Lock className='w-4 h-4' />}
                placeholder='Enter your password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

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
