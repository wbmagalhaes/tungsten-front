import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronUp } from 'lucide-react';
import { cn } from '@utils/cn';
import { sidebarItems } from './items';
import { useSidebarStore } from '@stores/useSidebarStore';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const { isOpen, close, toggle } = useSidebarStore();
  const location = useLocation();

  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) setProfileOpen(false);
  }, [isOpen]);

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
          'md:static md:translate-x-0 md:flex md:flex-col md:w-auto',
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
                      'pointer-events-none absolute left-full top-1/2 z-50 ml-5 -translate-y-1/2',
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

        <div className='mt-auto border-t p-2'>
          <div className='relative'>
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className={cn(
                'group flex w-full items-center gap-3 p-2 rounded-md text-left transition-colors',
                'hover:bg-gray-100',
              )}
            >
              <img
                src='/avatar.png'
                alt='user profile picture'
                className='h-8 w-8 rounded-sm object-cover bg-red-400'
              />

              <span className='flex-1 truncate text-sm font-medium text-nowrap'>
                william-magalhaes
              </span>

              {isOpen && (
                <ChevronUp
                  className={cn(
                    'h-4 w-4 transition-transform',
                    profileOpen && 'rotate-180',
                  )}
                />
              )}

              {!isOpen && (
                <span
                  className={cn(
                    'pointer-events-none absolute left-full top-1/2 z-50 ml-4 -translate-y-1/2',
                    'hidden md:block',
                    'rounded-md bg-gray-900 px-2 py-1 text-xs text-white shadow-lg',
                    'opacity-0 -translate-x-1 transition-all duration-150',
                    'group-hover:opacity-100 group-hover:translate-x-0',
                  )}
                >
                  william-magalhaes
                </span>
              )}
            </button>

            {profileOpen && (
              <div
                className={cn(
                  'absolute w-50',
                  isOpen ? 'bottom-full left-0' : 'bottom-0 left-full',
                  'rounded-md border bg-white shadow-lg',
                )}
              >
                <button className='block w-full px-3 py-2 text-sm hover:bg-gray-50 rounded-lg text-left'>
                  Profile
                </button>
                <button className='block w-full px-3 py-2 text-sm hover:bg-gray-50 rounded-lg text-left text-red-600'>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <div
          onClick={toggle}
          className={cn(
            'hidden md:block',
            'absolute top-0 right-0 h-full w-1',
            'cursor-col-resize',
            'hover:bg-gray-200/40',
          )}
        />
      </aside>
    </>
  );
}
