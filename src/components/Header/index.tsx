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
      <MiniLogo />
      <HeaderBreadcrumbs />
      <div className='ml-auto flex gap-2'>
        <HeaderCommands />
        <HeaderAlerts />
      </div>
    </header>
  );
}

function MiniLogo() {
  return (
    <div className='flex items-center justify-center h-8 w-8 bg-linear-to-br from-blue-600 to-purple-600 rounded-sm mr-4'>
      <span className='text-white font-bold text-sm mt-0.5'>W</span>
    </div>
  );
}
