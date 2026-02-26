import { ButtonLink } from '@components/base/button';
import { useAuthStore } from '@stores/useAuthStore';
import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className='min-h-screen flex flex-col'>
      <PublicHeader />
      <main className='flex-1 mt-24'>
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}

function PublicHeader() {
  const { isAuthenticated } = useAuthStore();

  return (
    <header className='fixed top-0 inset-x-0 bg-background/80 z-50'>
      <div className='container mx-auto px-4 py-4 flex justify-between items-center'>
        <ButtonLink to='/' render={<Logo />} />
        {isAuthenticated ? (
          <ButtonLink to='/root'>Access Console</ButtonLink>
        ) : (
          <div className='gap-4 hidden md:flex'>
            <ButtonLink className='min-w-28' to='/login'>
              Login
            </ButtonLink>
            <ButtonLink className='min-w-28' variant='secondary' to='/register'>
              Register
            </ButtonLink>
          </div>
        )}
      </div>
    </header>
  );
}

function PublicFooter() {
  return (
    <footer className='container mx-auto px-4 py-2 mt-20 border-t border-border'>
      <div className='text-start text-muted-foreground/80 text-xs'>
        <p>&copy; 2026 - tungsten</p>
      </div>
    </footer>
  );
}

function Logo() {
  return (
    <div className='flex items-center gap-3 cursor-pointer'>
      <div className='relative w-12 h-12 bg-main-gradient rounded-sm flex items-center justify-center'>
        <span className='text-white font-bold text-2xl'>W</span>
        <span className='absolute top-0.5 right-1 text-white text-[10px] font-bold font-mono'>
          74
        </span>
      </div>
    </div>
  );
}
