import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '@hooks/auth/use-login';
import { useRecoverPassword } from '@hooks/auth/use-recover-password';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import {
  LogIn,
  User,
  Lock,
  AlertCircle,
  Mail,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';
import { Card, CardContent } from '@components/base/card';
import { Button } from '@components/base/button';
import { TextField } from '@components/base/text-field';
import { PasswordField } from '@components/base/password-field';

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

type View = 'login' | 'recover' | 'recover-sent';

export default function LoginForm() {
  const navigate = useNavigate();
  const [view, setView] = useState<View>('login');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const loginTurnstileRef = useRef<TurnstileInstance | null>(null);
  const [loginToken, setLoginToken] = useState('');
  const login = useLogin();

  const [email, setEmail] = useState('');
  const recoverTurnstileRef = useRef<TurnstileInstance | null>(null);
  const [recoverToken, setRecoverToken] = useState('');
  const recover = useRecoverPassword();

  const handleLogin = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const cleanUsername = username.trim().toLowerCase();
    login.mutate(
      {
        username: cleanUsername,
        password,
        token: loginToken,
      },
      {
        onSuccess: () => {
          const params = new URLSearchParams(location.search);
          navigate(params.get('cb_url') || '/root', { replace: true });
        },
        onError: () => {
          setLoginToken('');
          loginTurnstileRef.current?.reset();
        },
      },
    );
  };

  const handleRecover = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const cleanUsername = username.trim().toLowerCase();
    login.mutate(
      { username: cleanUsername, password, token: loginToken },
      {
        onSuccess: () => {
          const params = new URLSearchParams(location.search);
          navigate(params.get('cb_url') || '/root', { replace: true });
        },
        onError: () => {
          setLoginToken('');
          loginTurnstileRef.current?.reset();
        },
      },
    );
  };

  if (view === 'recover-sent') {
    return (
      <Card>
        <CardContent className='p-6 text-center space-y-4'>
          <CheckCircle className='w-10 h-10 text-success mx-auto' />
          <p className='font-medium'>Check your email</p>
          <p className='text-sm text-muted-foreground'>
            If an account with that email exists, we sent a reset link.
          </p>
          <Button
            variant='outline'
            className='w-full'
            onClick={() => setView('login')}
          >
            <ArrowLeft className='w-4 h-4' />
            Back to Sign In
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (view === 'recover') {
    return (
      <Card>
        <CardContent className='p-6'>
          <form onSubmit={handleRecover} className='space-y-4'>
            <div>
              <p className='font-medium mb-1'>Recover password</p>
              <p className='text-sm text-muted-foreground'>
                Enter your email and we'll send you a reset link.
              </p>
            </div>

            <TextField
              label='Email'
              icon={<Mail className='w-4 h-4' />}
              type='email'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {recover.isError && (
              <div className='p-3 bg-destructive/30 border border-destructive rounded-sm text-destructive text-sm flex items-start gap-2'>
                <AlertCircle className='w-4 h-4 mt-0.5 shrink-0' />
                <span>{recover.error.message}</span>
              </div>
            )}

            <div className='flex flex-col gap-4 justify-center'>
              <Turnstile
                ref={recoverTurnstileRef}
                as='aside'
                className='max-w-full w-full'
                siteKey={SITE_KEY}
                onSuccess={(t) => setRecoverToken(t)}
                onExpire={() => {
                  setRecoverToken('');
                  recoverTurnstileRef.current?.reset();
                }}
                onError={() => {
                  setRecoverToken('');
                  recoverTurnstileRef.current?.reset();
                }}
                options={{
                  theme: 'dark',
                  language: 'en',
                  appearance: 'interaction-only',
                }}
              />
              <div className='flex gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  className='flex-1'
                  onClick={() => setView('login')}
                  disabled={recover.isPending}
                >
                  <ArrowLeft className='w-4 h-4' />
                  Back
                </Button>
                <Button
                  type='submit'
                  className='flex-1'
                  disabled={recover.isPending || !recoverToken || !email}
                >
                  <Mail className='w-4 h-4' />
                  {recover.isPending ? 'Sending...' : 'Send Link'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className='p-6'>
        <form onSubmit={handleLogin} className='space-y-4'>
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
          <div className='space-y-1'>
            <PasswordField
              id='password'
              label='Password'
              icon={<Lock className='w-4 h-4' />}
              placeholder='Enter your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className='flex justify-end'>
              <Button
                onClick={() => setView('recover')}
                size='sm'
                variant='link'
                className='p-0'
              >
                Forgot password?
              </Button>
            </div>
          </div>

          {login.isError && (
            <div className='p-3 bg-destructive/30 border border-destructive rounded-sm text-destructive text-sm flex items-start gap-2'>
              <AlertCircle className='w-4 h-4 mt-0.5 shrink-0' />
              <span>{login.error.message}</span>
            </div>
          )}

          <div className='flex flex-col gap-4 justify-center'>
            <Turnstile
              ref={loginTurnstileRef}
              as='aside'
              className='max-w-full w-full'
              siteKey={SITE_KEY}
              onSuccess={(t) => setLoginToken(t)}
              onExpire={() => {
                setLoginToken('');
                loginTurnstileRef.current?.reset();
              }}
              onError={() => {
                setLoginToken('');
                loginTurnstileRef.current?.reset();
              }}
              options={{
                theme: 'dark',
                language: 'en',
                appearance: 'interaction-only',
              }}
            />
            <Button
              type='submit'
              disabled={login.isPending || !loginToken}
              className='w-full'
            >
              <LogIn className='w-4 h-4' />
              {!loginToken
                ? 'Verifying your humanity...'
                : login.isPending
                  ? 'Signing in...'
                  : 'Sign In'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
