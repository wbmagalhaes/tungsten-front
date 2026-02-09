import { Link, useLocation } from 'react-router-dom';
import {
  CheckCircle,
  ChevronLeft,
  ChevronUp,
  CircleQuestionMark,
  Settings,
} from 'lucide-react';
import { cn } from '@utils/cn';
import { sidebarItems } from './items';
import { useSidebarStore } from '@stores/useSidebarStore';
import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@components/base/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@components/base/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@components/base/dropdown-menu';
import { Separator } from '@components/base/separator';
import { useGetProfile } from '@hooks/profile/use-get-profile';
import type { User } from '@models/user';
import { getInitials } from '@models/user';
import { useSwitchSudo } from '@hooks/auth/use-switch-sudo';
import { useAuthStore } from '@stores/useAuthStore';
import { Button } from '@components/base/button';

export default function Sidebar() {
  const { data: user, isLoading } = useGetProfile();

  return (
    <>
      <SidebarBackdrop />
      <SidebarContent>
        <SidebarHeader />

        <SidebarMenu>
          {sidebarItems.map(({ label, to, icon }) => (
            <SidebarMenuLink key={to} to={to} label={label} icon={icon} />
          ))}
        </SidebarMenu>

        <SidebarFooter>
          <SidebarMenuLink to='/config' label='Config' icon={Settings} />
          <SidebarMenuLink to='/help' label='Help' icon={CircleQuestionMark} />

          <Separator />

          <SidebarProfile user={user} loading={isLoading} />
        </SidebarFooter>

        <SidebarRail />
      </SidebarContent>
    </>
  );
}

function SidebarBackdrop() {
  const { isOpen, close } = useSidebarStore();

  return (
    <div
      className={cn(
        'fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity',
        isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
      onClick={close}
    />
  );
}

function SidebarContent({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebarStore();
  return (
    <aside
      className={cn(
        'z-50 bg-gray-900 border-r border-gray-700',
        'transition-all duration-300 ease-in-out',
        'flex flex-col fixed inset-y-0 left-0 w-64',
        'md:static md:translate-x-0 md:w-auto',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        isOpen ? 'md:w-56' : 'md:w-16',
      )}
    >
      {children}
    </aside>
  );
}

function SidebarHeader() {
  const { close } = useSidebarStore();

  return (
    <div className='flex items-center border-b border-gray-700 p-2 md:hidden'>
      <Button onClick={close} variant='ghost' size='icon'>
        <ChevronLeft className='h-5 w-5' />
      </Button>
    </div>
  );
}

function SidebarMenu({ children }: { children: React.ReactNode }) {
  return <nav className='flex flex-col gap-1.5 p-2 text-sm'>{children}</nav>;
}

type SidebarMenuItemProps = {
  className?: string;
  children: React.ReactNode;
  tooltip?: string;
  active?: boolean;
};

function SidebarMenuItem({
  className,
  children,
  tooltip,
  active,
}: SidebarMenuItemProps) {
  const { isOpen } = useSidebarStore();

  if (!tooltip) {
    return (
      <div
        className={cn(
          'flex items-center w-full gap-3 rounded-md px-3 py-2 transition-colors hover:bg-gray-800 text-gray-300',
          active && 'bg-gray-800 font-medium',
          className,
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <Tooltip disabled={isOpen}>
      <TooltipTrigger
        render={(props) => (
          <div
            {...props}
            className={cn(
              'flex items-center w-full gap-3 rounded-md px-3 py-2 transition-colors hover:bg-gray-800 text-gray-300',
              active && 'bg-gray-800 font-medium',
              className,
            )}
          >
            {children}
          </div>
        )}
      />

      <TooltipContent
        side='right'
        sideOffset={20}
        className='bg-gray-950 text-white'
      >
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

type SidebarMenuLinkProps = {
  to: string;
  icon: React.FunctionComponent<{ className: string }>;
  label: string;
};

function SidebarMenuLink({ to, icon: Icon, label }: SidebarMenuLinkProps) {
  const { close } = useSidebarStore();
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <Link to={to} onClick={close}>
      <SidebarMenuItem tooltip={label} active={active}>
        <Icon className='h-5 w-5 shrink-0 ml-0.5' />
        <span className='truncate'>{label}</span>
      </SidebarMenuItem>
    </Link>
  );
}

type SidebarProfileProps = {
  user?: User;
  loading: boolean;
};

function SidebarProfile({ user, loading }: SidebarProfileProps) {
  const { close } = useSidebarStore();

  const { isSudo } = useAuthStore();

  const displayName = user?.fullname ?? user?.username;
  const avatarSrc = user?.avatar;
  const avatarFallback = getInitials(user);

  const switchSudo = useSwitchSudo();
  const canBeSudo = user?.is_sudo ?? false;

  return (
    <SidebarMenuItem
      tooltip={loading ? displayName : undefined}
      className='p-2 hover:bg-transparent'
    >
      <DropdownMenu>
        <DropdownMenuTrigger
          className='flex w-full items-center gap-3 cursor-pointer'
          disabled={loading}
        >
          <Avatar
            className={cn(
              'after:border-0 bg-gray-950',
              isSudo && 'bg-red-500 ring-2 ring-red-500',
            )}
            loading={loading}
          >
            <AvatarImage src={avatarSrc} alt={`@${user?.username}`} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>

          <span className='flex-1 truncate text-left text-sm font-medium text-nowrap'>
            {displayName}
          </span>

          <ChevronUp className='h-4 w-4' />
        </DropdownMenuTrigger>

        <DropdownMenuContent side='top' sideOffset={20} className='bg-gray-800'>
          <DropdownMenuItem
            className='cursor-pointer hover:bg-gray-700 text-gray-200'
            render={<Link to='/profile'>Profile</Link>}
            onClick={close}
          />
          {canBeSudo && (
            <DropdownMenuItem
              className={'cursor-pointer hover:bg-gray-700 text-gray-200'}
              onClick={() => {
                switchSudo.mutate();
                close();
              }}
            >
              Sudo Mode
              {isSudo && (
                <span className='text-red-400 text-xs font-bold ml-auto'>
                  <CheckCircle />
                </span>
              )}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className='cursor-pointer hover:bg-gray-700 text-red-400'
            render={<Link to='/logout'>Logout</Link>}
            onClick={close}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}

function SidebarFooter({ children }: { children: React.ReactNode }) {
  return <div className='mt-auto flex flex-col gap-1 p-2'>{children}</div>;
}

function SidebarRail() {
  const { toggle } = useSidebarStore();

  return (
    <div
      onClick={toggle}
      className={cn(
        'hidden md:block',
        'absolute top-0 right-0 h-full w-1',
        'cursor-col-resize',
        'hover:bg-gray-200/40',
      )}
    />
  );
}
