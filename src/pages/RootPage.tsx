import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  StickyNote,
  HardDrive,
  UsersRound,
  Clock,
  Cpu,
  MemoryStick,
  Network,
  ArrowRight,
  TerminalIcon,
  ChevronRight,
  ServerCog,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardIcon,
  CardTitle,
  CardContent,
  CardFooter,
} from '@components/base/card';
import { Button, ButtonLink } from '@components/base/button';
import { useGetProfile } from '@hooks/profile/use-get-profile';
import useHealthCheck from '@hooks/system/use-health-check';
import { Avatar, AvatarImage, AvatarFallback } from '@components/base/avatar';
import { getInitials } from '@models/user';
import formatBytes from '@utils/formatBytes';
import { LoadingState } from '@components/LoadingState';

const HELP_COMMANDS = {
  help: 'Available commands: help, clear, status, users, notes, media, chat, jobs',
  clear: 'Clears the terminal',
  status: 'Shows system health status',
  users: 'Navigate to users page',
  notes: 'Navigate to notes page',
  media: 'Navigate to media page',
  chat: 'Navigate to chat page',
  jobs: 'Navigate to background jobs page',
};

interface TerminalLine {
  type: 'command' | 'output' | 'error';
  content: string;
}

export default function RootPage() {
  const { data: user, isLoading: userLoading } = useGetProfile();
  const { data: health } = useHealthCheck();
  const navigate = useNavigate();

  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([
    { type: 'output', content: 'Tungsten Terminal v1.0.0' },
    { type: 'output', content: 'Type "help" for available commands' },
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const terminalScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop =
        terminalScrollRef.current.scrollHeight;
    }
  }, [terminalLines]);

  if (userLoading) {
    return <LoadingState message='Loading dashboard...' />;
  }

  const displayName = user?.fullname || user?.username || 'User';
  const greeting = getGreeting();

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();

    setTerminalLines((prev) => [
      ...prev,
      { type: 'command', content: `$ ${cmd}` },
    ]);

    if (!trimmedCmd) return;

    if (trimmedCmd === 'clear') {
      setTerminalLines([]);
      return;
    }

    if (trimmedCmd === 'help') {
      Object.entries(HELP_COMMANDS).forEach(([cmd, desc]) => {
        setTerminalLines((prev) => [
          ...prev,
          { type: 'output', content: `  ${cmd.padEnd(10)} - ${desc}` },
        ]);
      });
      return;
    }

    if (trimmedCmd === 'status') {
      if (health) {
        setTerminalLines((prev) => [
          ...prev,
          { type: 'output', content: `CPU: ${health.cpu_usage.toFixed(1)}%` },
          {
            type: 'output',
            content: `Memory: ${((health.mem_used / health.mem_total) * 100).toFixed(1)}%`,
          },
          {
            type: 'output',
            content: `Disk: ${((health.disk_used / health.disk_total) * 100).toFixed(1)}%`,
          },
        ]);
      }
      return;
    }

    const navigationCommands: Record<string, string> = {
      users: '/users',
      notes: '/notes',
      media: '/media',
      chat: '/chat',
      jobs: '/background-jobs',
    };

    if (trimmedCmd in navigationCommands) {
      setTerminalLines((prev) => [
        ...prev,
        { type: 'output', content: `Navigating to ${trimmedCmd}...` },
      ]);
      setTimeout(() => navigate(navigationCommands[trimmedCmd]), 500);
      return;
    }

    setTerminalLines((prev) => [
      ...prev,
      {
        type: 'error',
        content: `Command not found: ${trimmedCmd}. Type "help" for available commands.`,
      },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(currentCommand);
      setCurrentCommand('');
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Avatar size='lg'>
            <AvatarImage src={user?.avatar} alt={`@${user?.username}`} />
            <AvatarFallback>{getInitials(user)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className='text-2xl font-bold text-foreground flex flex-wrap gap-x-2'>
              <span>{greeting},</span>
              <span>{displayName}!</span>
            </h1>
            <p className='text-sm text-muted-foreground'>
              Welcome back to Tungsten
            </p>
          </div>
        </div>
      </div>

      <Card className='bg-muted/20 border-primary/30'>
        <CardHeader>
          <CardIcon className='text-primary'>
            <TerminalIcon className='w-5 h-5' />
          </CardIcon>
          <CardTitle>Terminal</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            ref={terminalScrollRef}
            className='bg-background/50 rounded-sm p-4 font-mono text-sm h-64 overflow-y-auto'
          >
            {terminalLines.map((line, i) => (
              <div
                key={i}
                className={
                  line.type === 'command'
                    ? 'text-primary'
                    : line.type === 'error'
                      ? 'text-destructive'
                      : 'text-muted-foreground'
                }
              >
                {line.content}
              </div>
            ))}
            <div className='flex items-center gap-2 mt-2'>
              <ChevronRight className='w-4 h-4 text-accent' />
              <input
                type='text'
                value={currentCommand}
                onChange={(e) => setCurrentCommand(e.target.value)}
                onKeyDown={handleKeyDown}
                className='flex-1 bg-transparent outline-none text-foreground'
                placeholder='Type a command...'
                autoFocus
              />
            </div>
            <div ref={terminalEndRef} />
          </div>
        </CardContent>
        <CardFooter className='flex-col sm:flex-row gap-3 py-3 px-4'>
          {health && (
            <>
              <div className='flex flex-wrap gap-x-4 gap-y-2 w-full overflow-x-auto'>
                <SystemMetric
                  icon={<Clock className='w-4 h-4' />}
                  label='Time'
                  value={new Date(health.current_time).toLocaleTimeString(
                    'pt-BR',
                  )}
                />
                <SystemMetric
                  icon={<Cpu className='w-4 h-4' />}
                  label='CPU'
                  value={`${health.cpu_usage.toFixed(1)}%`}
                  status={health.cpu_usage > 80 ? 'warning' : 'normal'}
                />
                <SystemMetric
                  icon={<MemoryStick className='w-4 h-4' />}
                  label='Memory'
                  value={`${((health.mem_used / health.mem_total) * 100).toFixed(1)}%`}
                  status={
                    (health.mem_used / health.mem_total) * 100 > 90
                      ? 'warning'
                      : 'normal'
                  }
                />
                <SystemMetric
                  icon={<HardDrive className='w-4 h-4' />}
                  label='Disk'
                  value={`${((health.disk_used / health.disk_total) * 100).toFixed(1)}%`}
                  status={
                    (health.disk_used / health.disk_total) * 100 > 90
                      ? 'warning'
                      : 'normal'
                  }
                />
                <SystemMetric
                  icon={<Network className='w-4 h-4' />}
                  label='Network'
                  value={formatBytes(health.net_in + health.net_out)}
                />
              </div>

              <ButtonLink
                variant='ghost'
                size='sm'
                className='ml-auto shrink-0'
                to='/system-health'
              >
                View Details
                <ArrowRight className='w-4 h-4' />
              </ButtonLink>
            </>
          )}
        </CardFooter>
      </Card>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        <Card>
          <CardHeader>
            <CardIcon>
              <Activity className='w-5 h-5' />
            </CardIcon>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>

          <CardContent className='space-y-2'>
            <QuickActionCard
              icon={<StickyNote className='w-5 h-5' />}
              title='Notes'
              description='Create and manage notes'
              onClick={() => navigate('/notes')}
            />
            <QuickActionCard
              icon={<HardDrive className='w-5 h-5' />}
              title='Media'
              description='Upload and manage files'
              onClick={() => navigate('/media')}
            />
            <QuickActionCard
              icon={<UsersRound className='w-5 h-5' />}
              title='Users'
              description='Manage user accounts'
              onClick={() => navigate('/users')}
            />
            <QuickActionCard
              icon={<Activity className='w-5 h-5' />}
              title='System Health'
              description='Monitor system status'
              onClick={() => navigate('/system-health')}
            />
            <QuickActionCard
              icon={<ServerCog className='w-5 h-5' />}
              title='Background Jobs'
              description='Manage long running jobs'
              onClick={() => navigate('/background-jobs')}
            />
          </CardContent>
        </Card>

        <RecentNotesCard />
      </div>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

interface SystemMetricProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  status?: 'normal' | 'warning';
}

function SystemMetric({
  icon,
  label,
  value,
  status = 'normal',
}: SystemMetricProps) {
  return (
    <div className='flex items-center gap-1 shrink-0'>
      <div className='text-primary'>{icon}</div>
      <p className='text-xs text-muted-foreground mr-1'>{label}</p>
      <p
        className={`text-sm font-bold whitespace-nowrap ${
          status === 'warning' ? 'text-warning' : 'text-foreground'
        }`}
      >
        {value}
      </p>
    </div>
  );
}

interface QuickActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

function QuickActionCard({
  icon,
  title,
  description,
  onClick,
}: QuickActionCardProps) {
  return (
    <div
      className='flex items-center gap-3 p-3 rounded-sm hover:bg-muted/50 transition-colors cursor-pointer border border-transparent hover:border-primary/30'
      onClick={onClick}
    >
      <div className='p-2 bg-primary/10 rounded-sm text-primary shrink-0'>
        {icon}
      </div>
      <div className='flex-1 min-w-0'>
        <h3 className='font-semibold text-foreground text-sm'>{title}</h3>
        <p className='text-xs text-muted-foreground truncate'>{description}</p>
      </div>
      <ArrowRight className='w-4 h-4 text-muted-foreground shrink-0' />
    </div>
  );
}

function RecentNotesCard() {
  // TODO: Implement endpoint GET /api/notes/recent?limit=5
  const notes = [
    {
      id: 1,
      title: 'Project Ideas',
      preview: 'Some interesting project concepts to explore...',
      updated: '3 hours ago',
    },
    {
      id: 2,
      title: 'Meeting Notes - Q1 Review',
      preview: 'Discussed quarterly performance and upcoming goals...',
      updated: '1 day ago',
    },
    {
      id: 3,
      title: 'TODO List',
      preview: 'Tasks for this week: Update documentation, fix bugs...',
      updated: '2 days ago',
    },
    {
      id: 4,
      title: 'Server Configuration',
      preview: 'Notes on setting up the new production environment...',
      updated: '3 days ago',
    },
  ];

  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardIcon>
          <StickyNote className='w-5 h-5' />
        </CardIcon>
        <CardTitle>Recent Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-2'>
          {notes.map((note) => (
            <div
              key={note.id}
              className='p-3 rounded-sm hover:bg-muted/30 transition-colors cursor-pointer'
              onClick={() => navigate(`/notes/${note.id}`)}
            >
              <div className='flex items-start justify-between gap-2 mb-1'>
                <h4 className='font-medium text-foreground text-sm'>
                  {note.title}
                </h4>
                <span className='text-xs text-muted-foreground whitespace-nowrap'>
                  {note.updated}
                </span>
              </div>
              <p className='text-xs text-muted-foreground line-clamp-1'>
                {note.preview}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant='ghost'
          size='sm'
          className='ml-auto'
          onClick={() => navigate('/notes')}
        >
          View All Notes
          <ArrowRight className='w-4 h-4' />
        </Button>
      </CardFooter>
    </Card>
  );
}
