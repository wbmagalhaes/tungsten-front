import { Dot } from 'lucide-react';
import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <div className='flex flex-col items-center justify-center pt-16'>
      <div className='w-full max-w-md space-y-4'>
        <LoginForm />

        <p className='text-sm text-muted-foreground flex gap-1 justify-center'>
          <span>Tungsten Server</span>
          <Dot />
          <span>Personal Self-Hosted</span>
        </p>
      </div>
    </div>
  );
}
