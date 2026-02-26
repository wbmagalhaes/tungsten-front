import { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegister } from '@hooks/auth/use-register';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { UserPlus, User, Lock, AlertCircle, Dot } from 'lucide-react';
import { Card, CardContent } from '@components/base/card';
import { Button } from '@components/base/button';
import { TextField } from '@components/base/text-field';
import { PasswordField } from '@components/base/password-field';
import validateUsername from './validateUsername';
import { validatePassword } from './validatePassword';

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

export default function RegisterPage() {
  const navigate = useNavigate();
  const register = useRegister();
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');

  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const passwordMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordMismatch) return;

    register.mutate(
      { username, password, token },
      {
        onSuccess: () => navigate('/root', { replace: true }),
        onError: () => {
          setToken('');
          turnstileRef.current?.reset();
        },
      },
    );
  };

  return (
    <div className='min-h-screen flex justify-center p-4 mt-8 md:mt-32'>
      <div className='w-full max-w-xl space-y-4'>
        <Card>
          <CardContent className='p-6'>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <TextField
                label='Username'
                icon={<User className='w-4 h-4' />}
                placeholder='Choose a username'
                value={username}
                onChange={(e) => {
                  const value = e.target.value;
                  setUsername(value);
                  setUsernameError(validateUsername(value));
                }}
                error={usernameError ?? undefined}
                required
              />

              <PasswordField
                label='Password'
                icon={<Lock className='w-4 h-4' />}
                placeholder='Choose a password'
                value={password}
                onChange={(e) => {
                  const value = e.target.value;
                  setPassword(value);
                  setPasswordError(validatePassword(value));
                }}
                error={passwordError ?? undefined}
                required
              />

              <PasswordField
                label='Confirm Password'
                icon={<Lock className='w-4 h-4' />}
                placeholder='Repeat your password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={passwordMismatch ? 'Passwords do not match' : undefined}
                required
              />

              {register.isError && (
                <div className='p-3 bg-destructive/30 border border-destructive rounded-sm text-destructive text-sm flex items-start gap-2'>
                  <AlertCircle className='w-4 h-4 mt-0.5 shrink-0' />
                  <span>{register.error.message}</span>
                </div>
              )}

              <div className='flex flex-col gap-4'>
                <Turnstile
                  ref={turnstileRef}
                  as='aside'
                  className='max-w-full w-full'
                  siteKey={SITE_KEY}
                  onSuccess={(t) => setToken(t)}
                  onExpire={() => {
                    setToken('');
                    turnstileRef.current?.reset();
                  }}
                  onError={() => {
                    setToken('');
                    turnstileRef.current?.reset();
                  }}
                  options={{
                    theme: 'dark',
                    language: 'en',
                    appearance: 'interaction-only',
                  }}
                />
                <Button
                  type='submit'
                  className='w-full'
                  disabled={
                    register.isPending ||
                    !token ||
                    passwordMismatch ||
                    !username ||
                    !password ||
                    !!usernameError ||
                    !!passwordError
                  }
                >
                  <UserPlus className='w-4 h-4' />
                  {!token
                    ? 'Verifying your humanity...'
                    : register.isPending
                      ? 'Creating account...'
                      : 'Create Account'}
                </Button>
              </div>

              <p className='text-center text-sm text-muted-foreground'>
                Already have an account?{' '}
                <Link to='/login' className='text-foreground hover:underline'>
                  Sign in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>

        <p className='text-sm text-muted-foreground flex gap-1 justify-center'>
          <span>Tungsten Server</span>
          <Dot />
          <span>Personal Self-Hosted</span>
        </p>
      </div>
    </div>
  );
}
