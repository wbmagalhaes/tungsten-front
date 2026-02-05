import { Menu } from 'lucide-react';
import { useSidebarStore } from '@stores/useSidebarStore';
import { HeaderCommands } from './HeaderCommands';
import { HeaderBreadcrumbs } from './HeaderBreadcrumbs';
import { HeaderAlerts } from './HeaderAlerts';

export default function Header() {
  const { toggle } = useSidebarStore();
  return (
    <header className='h-12 flex items-center gap-3 px-2 md:px-4 border-b border-gray-700 bg-gray-800'>
      <button
        onClick={toggle}
        className='block md:hidden p-2 rounded-md hover:bg-gray-700'
      >
        <Menu className='h-5 w-5 text-gray-200' />
      </button>
      <HeaderBreadcrumbs />
      <div className='ml-auto flex gap-2'>
        <HeaderCommands />
        <HeaderAlerts />
      </div>
    </header>
  );
}
