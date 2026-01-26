import { Menu } from 'lucide-react';
import { useSidebarStore } from '@stores/useSidebarStore';

export default function Header() {
  const { toggle } = useSidebarStore();

  return (
    <header className='h-12 flex items-center gap-3 px-4 border-b bg-white'>
      <button
        onClick={toggle}
        className='block md:hidden p-2 rounded-md hover:bg-gray-100'
      >
        <Menu className='h-5 w-5' />
      </button>

      <h1 className='text-lg font-bold'>Tungsten</h1>
    </header>
  );
}
