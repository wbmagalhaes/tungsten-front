import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@utils/cn';
import { sidebarItems } from './items';
import { useSidebarStore } from '@stores/useSidebarStore';

export default function SideBar() {
  const { isOpen, close } = useSidebarStore();
  const location = useLocation();

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={close}
      />
      <aside
        className={cn(
          'z-50 bg-white border-r',
          'transition-all duration-300 ease-in-out',
          'fixed inset-y-0 left-0 w-64',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'md:static md:translate-x-0 md:block md:w-auto',
          isOpen ? 'md:w-56' : 'md:w-16',
        )}
      >
        <div className='flex items-center border-b px-3 py-1 md:hidden'>
          <button onClick={close} className='rounded-md p-2 hover:bg-gray-100'>
            <ChevronLeft className='h-5 w-5' />
          </button>
        </div>

        <nav className='flex flex-col gap-1 p-2 text-sm'>
          {sidebarItems.map(({ label, to, icon: Icon }) => {
            const active = location.pathname === to;

            return (
              <Link
                key={to}
                to={to}
                onClick={close}
                className={cn(
                  'group relative flex items-center gap-3 rounded-md px-3 py-2 transition-colors',
                  active ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50',
                )}
              >
                <Icon className='h-5 w-5 shrink-0' />
                <span className='truncate'>{label}</span>

                {!isOpen && (
                  <span
                    className={cn(
                      'pointer-events-none absolute left-full top-1/2 z-50 ml-4 -translate-y-1/2',
                      'hidden md:block',
                      'rounded-md bg-gray-900 px-2 py-1 text-xs text-white shadow-lg',
                      'opacity-0 -translate-x-1 transition-all duration-150',
                      'group-hover:opacity-100 group-hover:translate-x-0',
                      'text-nowrap',
                    )}
                  >
                    {label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
