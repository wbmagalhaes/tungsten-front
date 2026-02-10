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
    <header className='fixed top-0 inset-x-0 bg-background z-50'>
      <div className='container mx-auto px-4 py-6 flex justify-between items-center'>
        <ButtonLink to='/' render={<Logo />} />
        {isAuthenticated ? (
          <ButtonLink to='/root'>Console</ButtonLink>
        ) : (
          <ButtonLink to='/login'>Login</ButtonLink>
        )}
      </div>
    </header>
  );
}

function PublicFooter() {
  return (
    <footer className='container mx-auto px-4 py-4 mt-20 border-t border-border'>
      <div className='text-start text-muted-foreground'>
        <p>&copy; 2026 tungsten</p>
      </div>
    </footer>
  );
}

function Logo() {
  return (
    <div className='flex items-center gap-3 cursor-pointer'>
      <div className='relative w-12 h-12 bg-main-gradient rounded-sm flex items-center justify-center'>
        <span className='text-foreground font-bold text-2xl'>W</span>
        <span className='absolute top-0.5 right-1 text-foreground text-[10px] font-bold font-mono'>
          74
        </span>
      </div>
      <span className='text-2xl font-bold text-foreground'>Tungsten</span>
    </div>
  );
}
