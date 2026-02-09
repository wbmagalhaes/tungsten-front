import { Link, useLocation } from 'react-router-dom';
import { useSwipeable, type SwipeableHandlers } from 'react-swipeable';
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
import React, { useCallback, useEffect, useMemo, type ReactNode } from 'react';
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
import { useIsDesktop } from '@hooks/use-is-desktop';
import { filterItemsByPermission } from '@utils/hasPermission';

export default function Sidebar() {
  const { data: user, isLoading } = useGetProfile();

  const { open, close } = useSidebarStore();

  const visibleItems = useMemo(() => {
    const userScopes = user?.scope ?? [];
    return filterItemsByPermission(sidebarItems, userScopes);
  }, [user]);

  const openHandlers = useSwipeable({
    onSwipedRight: () => open(),
    delta: 50,
  });

  const closeHandlers = useSwipeable({
    onSwipedLeft: () => close(),
    delta: 50,
  });

  return (
    <>
      <SidebarBackdrop />
      <SidebarSwipeZone handlers={openHandlers} />
      <SidebarContent handlers={closeHandlers}>
        <SidebarHeader />

        <SidebarMenu>
          {visibleItems.map(({ label, to, icon }) => (
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

function SidebarSwipeZone({ handlers }: { handlers: SwipeableHandlers }) {
  return (
    <div
      className='fixed top-12 left-0 h-full w-6 z-50 touch-action-pan-y md:hidden '
      {...handlers}
    />
  );
}

function SidebarContent({
  children,
  handlers,
}: {
  children: ReactNode;
  handlers: SwipeableHandlers;
}) {
  const { isOpen, width } = useSidebarStore();
  const desktop = useIsDesktop();

  return (
    <aside
      style={{ width: desktop ? width : undefined }}
      className={cn(
        'z-50 bg-gray-900 border-r border-border rounded-r-sm md:rounded-none shadow-lg',
        'flex flex-col fixed inset-y-0 left-0 w-64',
        'transition-all md:static',
        !desktop && 'duration-200 ease-in-out',
        desktop && 'duration-100',
        !desktop && (isOpen ? 'translate-x-0' : '-translate-x-full'),
        desktop && 'translate-x-0',
        desktop ? '' : 'w-72 max-w-full',
      )}
      {...handlers}
    >
      {children}
    </aside>
  );
}

function SidebarHeader() {
  const { close } = useSidebarStore();

  return (
    <div className='flex items-center border-b border-border p-2 md:hidden'>
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
  const { width } = useSidebarStore();

  if (!tooltip) {
    return (
      <div
        className={cn(
          'flex items-center w-full gap-3 rounded-md px-3 py-2 transition-colors hover:bg-accent/50 text-foreground',
          active && 'bg-accent/50 font-medium',
          className,
        )}
      >
        {children}
      </div>
    );
  }

  const disabled = width > 128;

  return (
    <Tooltip disabled={disabled}>
      <TooltipTrigger
        render={(props) => (
          <div
            {...props}
            className={cn(
              'flex items-center w-full gap-3 rounded-md px-3 py-2 transition-colors hover:bg-accent/50 text-foreground',
              active && 'bg-accent/50 font-medium',
              className,
            )}
          >
            {children}
          </div>
        )}
      />

      <TooltipContent side='right' sideOffset={20}>
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
            className={cn(isSudo && 'bg-destructive ring-2 ring-destructive')}
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

        <DropdownMenuContent side='top' sideOffset={20}>
          <DropdownMenuItem
            render={<Link to='/profile'>Profile</Link>}
            onClick={close}
          />
          {canBeSudo && (
            <DropdownMenuItem
              onClick={() => {
                switchSudo.mutate();
                close();
              }}
            >
              Sudo Mode
              {isSudo && (
                <span className='text-destructive text-xs font-bold ml-auto'>
                  <CheckCircle />
                </span>
              )}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            variant='destructive'
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
  const { width, setWidth } = useSidebarStore();
  const [dragging, setDragging] = React.useState(false);

  const minWidth = 64;
  const maxWidth = 280;

  const startDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const stopDrag = () => setDragging(false);

  const onDrag = useCallback(
    (e: MouseEvent) => {
      if (!dragging) return;

      const newWidth = e.clientX;

      if (newWidth > 240) {
        setWidth(maxWidth);
      } else if (newWidth < 100) {
        setWidth(minWidth);
      } else if (newWidth >= minWidth && newWidth <= maxWidth) {
        setWidth(newWidth);
      }
    },
    [dragging, setWidth],
  );

  const handleClick = () => {
    const midpoint = (minWidth + maxWidth) / 2;
    if (width >= midpoint) {
      setWidth(minWidth);
    } else {
      setWidth(maxWidth);
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', stopDrag);
    return () => {
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('mouseup', stopDrag);
    };
  }, [dragging, onDrag]);

  return (
    <div
      onMouseDown={startDrag}
      onClick={handleClick}
      className={cn(
        'hidden md:block absolute top-0 right-0 h-full w-1 cursor-col-resize',
        'hover:bg-gray-200/40 transition-colors',
      )}
    />
  );
}
