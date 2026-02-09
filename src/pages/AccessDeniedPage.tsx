import { ShieldBan, Home, User2 } from 'lucide-react';
import { Card, CardContent } from '@components/base/card';
import { ButtonLink } from '@components/base/button';

export default function AccessDeniedPage() {
  return (
    <div className='flex flex-1 items-center justify-center p-6 mt-12'>
      <div className='max-w-xl w-full'>
        <Card className='backdrop-blur'>
          <CardContent className='p-8 text-center'>
            <div className='flex justify-center mb-4'>
              <ShieldBan className='h-14 w-14 text-red-400' />
            </div>
            <h1 className='text-3xl font-bold mb-2 text-white'>
              403 - Access denied
            </h1>
            <p className='text-gray-400 mb-6'>
              You do not have permission to access this page.
            </p>
            <div className='flex gap-3 justify-center flex-wrap'>
              <ButtonLink
                to='/root'
                variant='secondary'
                className='w-full max-w-40 sm:w-auto'
              >
                <Home className='h-4 w-4' />
                Back to Root
              </ButtonLink>
              <ButtonLink
                to='/profile'
                variant='secondary'
                className='w-full max-w-40 sm:w-auto'
              >
                <User2 className='h-4 w-4' />
                Your profile
              </ButtonLink>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
