import { Menu } from 'lucide-react';
import { useSidebarStore } from '@stores/useSidebarStore';
import { HeaderCommands } from './HeaderCommands';
import { HeaderBreadcrumbs } from './HeaderBreadcrumbs';
import { HeaderAlerts } from './HeaderAlerts';

export default function Header() {
  const { toggle } = useSidebarStore();
  return (
    <header className='fixed z-50 top-0 inset-x-0'>
      <div className='h-12 flex items-center gap-2 md:gap-3 px-2 md:px-4 border-b border-border bg-background'>
        <button
          onClick={toggle}
          className='block md:hidden p-2 rounded-md hover:bg-secondary'
        >
          <Menu className='h-5 w-5 text-foreground' />
        </button>

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
