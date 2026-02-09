import { Home, LogIn } from 'lucide-react';
import { Card, CardContent } from '@components/base/card';
import { ButtonLink } from '@components/base/button';

interface NotFoundProps {
  isAuthenticated?: boolean;
}

export default function NotFoundPage({ isAuthenticated }: NotFoundProps) {
  return (
    <div className='flex flex-1 items-center justify-center p-6 mt-12'>
      <div className='max-w-xl w-full'>
        <Card className='backdrop-blur'>
          <CardContent className='p-8 text-center'>
            <h1 className='text-5xl font-extrabold mb-3 text-white'>404</h1>
            <p className='text-xl font-semibold mb-2 text-white'>
              Page not found
            </p>
            <p className='text-gray-400 mb-6'>
              The route you tried to access does not exist or was moved.
            </p>
            <div className='flex gap-3 justify-center flex-wrap'>
              {isAuthenticated ? (
                <ButtonLink to='/root' variant='secondary'>
                  <Home className='h-4 w-4' />
                  Back to Root
                </ButtonLink>
              ) : (
                <>
                  <ButtonLink to='/' variant='secondary'>
                    <Home className='h-4 w-4' />
                    Home
                  </ButtonLink>
                  <ButtonLink to='/login'>
                    <LogIn className='h-4 w-4' />
                    Login
                  </ButtonLink>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
