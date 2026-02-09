import { Menu } from 'lucide-react';
import { useSidebarStore } from '@stores/useSidebarStore';
import { HeaderCommands } from './HeaderCommands';
import { HeaderBreadcrumbs } from './HeaderBreadcrumbs';
import { HeaderAlerts } from './HeaderAlerts';
import { Link } from 'react-router-dom';

export default function Header() {
  const { toggle } = useSidebarStore();
  return (
    <header className='fixed top-0 inset-x-0'>
      <div className='h-12 flex items-center gap-2 md:gap-3 pl-2 pr-1 md:px-4 border-b border-border bg-background'>
        <button
          onClick={toggle}
          className='block md:hidden p-2 rounded-md hover:bg-secondary'
        >
          <Menu className='h-5 w-5 text-foreground' />
        </button>

        <div className='shrink-0 md:mr-4'>
          <MiniLogo />
        </div>

        <div className='flex-1 overflow-hidden mr-1 md:mr-4'>
          <HeaderBreadcrumbs />
        </div>

        <div className='ml-auto shrink-0 flex gap-1 md:gap-2'>
          <HeaderCommands />
          <HeaderAlerts />
        </div>
      </div>
    </header>
  );
}

function MiniLogo() {
  return (
    <Link to='/'>
      <div className='flex items-center justify-center h-8 w-8  bg-linear-to-br from-blue-600 to-purple-600 rounded-sm'>
        <span className='text-foreground font-bold text-sm mt-0.5'>W</span>
      </div>
    </Link>
  );
}
