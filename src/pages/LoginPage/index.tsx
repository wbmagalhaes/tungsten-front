import { Dot } from 'lucide-react';
import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <div className='min-h-screen flex justify-center p-4 mt-8 md:mt-32'>
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
