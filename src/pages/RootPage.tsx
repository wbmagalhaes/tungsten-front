import { useNavigate } from 'react-router-dom';
import {
  Activity,
  StickyNote,
  HardDrive,
  UsersRound,
  Server,
  Clock,
  TrendingUp,
  FileText,
  ArrowRight,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardIcon,
  CardTitle,
  CardContent,
  CardFooter,
} from '@components/base/card';
import { Button } from '@components/base/button';
import { Badge } from '@components/base/badge';
import { useGetProfile } from '@hooks/profile/use-get-profile';
import useHealthCheck from '@hooks/system/use-health-check';
import { Avatar, AvatarImage, AvatarFallback } from '@components/base/avatar';
import { getInitials } from '@models/user';
import formatBytes from '@utils/formatBytes';
import { LoadingState } from '@components/LoadingState';

export default function RootPage() {
  const { data: user, isLoading: userLoading } = useGetProfile();
  const { data: health, isLoading: healthLoading } = useHealthCheck();
  const navigate = useNavigate();

  if (userLoading || healthLoading) {
    return <LoadingState message='Loading content...' />;
  }

  const displayName = user?.fullname || user?.username || 'User';
  const greeting = getGreeting();

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Avatar size='lg'>
            <AvatarImage src={user?.avatar} alt={`@${user?.username}`} />
            <AvatarFallback>{getInitials(user)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className='text-2xl font-bold text-foreground'>
              {greeting}, {displayName}!
            </h1>
            <p className='text-sm text-muted-foreground'>
              Welcome back to Tungsten
            </p>
          </div>
        </div>
        <Badge variant='default' className='gap-2'>
          <Clock className='w-3 h-3' />
          {new Date().toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })}
        </Badge>
      </div>

      {health && (
        <Card>
          <CardHeader>
            <CardIcon>
              <Server className='w-5 h-5' />
            </CardIcon>
            <CardTitle>System Status</CardTitle>
            <Badge variant='success' className='ml-auto'>
              Online
            </Badge>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <SystemMetric
                label='CPU Usage'
                value={`${health.cpu_usage.toFixed(1)}%`}
                status={health.cpu_usage > 80 ? 'warning' : 'normal'}
              />
              <SystemMetric
                label='Memory'
                value={`${((health.mem_used / health.mem_total) * 100).toFixed(1)}%`}
                status={
                  (health.mem_used / health.mem_total) * 100 > 90
                    ? 'warning'
                    : 'normal'
                }
              />
              <SystemMetric
                label='Disk'
                value={`${((health.disk_used / health.disk_total) * 100).toFixed(1)}%`}
                status={
                  (health.disk_used / health.disk_total) * 100 > 90
                    ? 'warning'
                    : 'normal'
                }
              />
              <SystemMetric
                label='Network'
                value={formatBytes(health.net_in + health.net_out)}
                status='normal'
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant='ghost'
              size='sm'
              className='ml-auto'
              onClick={() => navigate('/system-health')}
            >
              View Details
              <ArrowRight className='w-4 h-4' />
            </Button>
          </CardFooter>
        </Card>
      )}

      <div>
        <h2 className='text-lg font-semibold text-foreground mb-3'>
          Quick Actions
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          <QuickActionCard
            icon={<StickyNote className='w-6 h-6' />}
            title='Notes'
            description='Create and manage notes'
            onClick={() => navigate('/notes')}
          />
          <QuickActionCard
            icon={<HardDrive className='w-6 h-6' />}
            title='Media'
            description='Upload and manage files'
            onClick={() => navigate('/media')}
          />
          <QuickActionCard
            icon={<UsersRound className='w-6 h-6' />}
            title='Users'
            description='Manage user accounts'
            onClick={() => navigate('/users')}
          />
          <QuickActionCard
            icon={<Activity className='w-6 h-6' />}
            title='System Health'
            description='Monitor system status'
            onClick={() => navigate('/system-health')}
          />
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        <RecentActivityCard />
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
  label: string;
  value: string;
  status: 'normal' | 'warning';
}

function SystemMetric({ label, value, status }: SystemMetricProps) {
  return (
    <div>
      <p className='text-xs text-muted-foreground mb-1'>{label}</p>
      <p
        className={`text-lg font-bold ${
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
    <Card
      className='cursor-pointer hover:bg-muted/50 transition-colors'
      onClick={onClick}
    >
      <CardContent className='flex items-start gap-3 p-4'>
        <div className='p-2 bg-primary/10 rounded-lg text-primary'>{icon}</div>
        <div className='flex-1'>
          <h3 className='font-semibold text-foreground mb-1'>{title}</h3>
          <p className='text-sm text-muted-foreground'>{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function RecentActivityCard() {
  // TODO: Implement endpoint GET /api/activity/recent
  const activities = [
    {
      id: 1,
      type: 'user',
      message: 'New user registered: johndoe',
      time: '2 hours ago',
      icon: <UsersRound className='w-4 h-4' />,
    },
    {
      id: 2,
      type: 'file',
      message: 'File uploaded: presentation.pdf',
      time: '5 hours ago',
      icon: <FileText className='w-4 h-4' />,
    },
    {
      id: 3,
      type: 'system',
      message: 'System updates applied',
      time: '1 day ago',
      icon: <Activity className='w-4 h-4' />,
    },
    {
      id: 4,
      type: 'note',
      message: 'Note created: Meeting notes',
      time: '2 days ago',
      icon: <StickyNote className='w-4 h-4' />,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardIcon>
          <TrendingUp className='w-5 h-5' />
        </CardIcon>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          {activities.map((activity) => (
            <div
              key={activity.id}
              className='flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors'
            >
              <div className='p-1.5 bg-primary/10 rounded text-primary mt-0.5'>
                {activity.icon}
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-sm text-foreground'>{activity.message}</p>
                <p className='text-xs text-muted-foreground mt-0.5'>
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
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
              className='p-3 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer'
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
