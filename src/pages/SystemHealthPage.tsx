import {
  Cpu,
  HardDrive,
  MemoryStick,
  Network,
  Battery,
  Monitor,
  Server,
  Wrench,
  RefreshCw,
  RotateCcw,
  Power,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardIcon,
  CardTitle,
  CardContent,
} from '@components/base/card';
import { Button } from '@components/base/button';
import useHealthCheck from '@hooks/system/use-health-check';
import useCheckUpdates from '@hooks/system/use-check-updates';
import useApplyUpdates from '@hooks/system/use-apply-updates';
import useRebootSystem from '@hooks/system/use-reboot-system';
import useShutdownSystem from '@hooks/system/use-shutdown-system';
import formatBytes from '@utils/formatBytes';
import formatTime from '@utils/formatTime';

export default function SystemHealthPage() {
  const { data, isLoading, error } = useHealthCheck();

  const updates = useCheckUpdates();
  const applyUpdates = useApplyUpdates();

  const reboot = useRebootSystem();
  const shutdown = useShutdownSystem();

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-muted-foreground'>Loading system data...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-red-400'>Error loading system data</div>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <SystemCard
        title='System Actions'
        icon={<Wrench className='w-5 h-5' />}
        className='col-span-full'
      >
        <div className='flex flex-wrap gap-2'>
          <Button
            size='sm'
            variant='secondary'
            onClick={() => updates.refetch()}
            disabled={updates.isFetching}
          >
            <RefreshCw className='w-4 h-4' />
            Check Updates
          </Button>

          <Button
            size='sm'
            onClick={() => applyUpdates.mutate({})}
            disabled={applyUpdates.isPending}
          >
            Apply Updates
          </Button>

          <Button
            size='sm'
            variant='secondary'
            onClick={() => reboot.mutate()}
            disabled={reboot.isPending}
          >
            <RotateCcw className='w-4 h-4' />
            Reboot
          </Button>

          <Button
            size='sm'
            variant='destructive'
            onClick={() => shutdown.mutate()}
            disabled={shutdown.isPending}
          >
            <Power className='w-4 h-4' />
            Shutdown
          </Button>
        </div>

        {updates.data?.available && (
          <div className='text-sm text-yellow-400 mt-2'>
            Updates available: {updates.data.available}
          </div>
        )}
      </SystemCard>
      <SystemCard
        title='System'
        icon={<Server className='w-5 h-5' />}
        className='col-span-full'
      >
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:divide-x divide-secondary'>
          <div className='md:pr-4'>
            <InfoItem label='Hostname' value={data.hostname} />
          </div>
          <div className='md:pr-4'>
            <InfoItem label='OS' value={data.os_version} />
          </div>
          <div className='md:pr-4'>
            <InfoItem label='Kernel' value={data.kernel_version} />
          </div>
          <div className='md:pr-4'>
            <InfoItem label='Uptime' value={formatTime(data.uptime)} />
          </div>
          <div className='md:pr-4'>
            <InfoItem
              label='Current Time'
              value={new Date(data.current_time).toLocaleString('pt-BR')}
            />
          </div>
        </div>
      </SystemCard>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <SystemCard title='CPU' icon={<Cpu className='w-5 h-5' />}>
          <div className='space-y-3'>
            <div>
              <div className='flex justify-between items-center mb-1'>
                <span className='text-sm text-muted-foreground'>Usage</span>
                <span className='text-lg font-bold text-foreground text-nowrap'>
                  {data.cpu_usage.toFixed(1)}%
                </span>
              </div>
              <ProgressBar value={data.cpu_usage} />
            </div>

            <div className='pt-2 border-t border-border'>
              <h4 className='text-sm font-semibold text-foreground mb-2'>
                Temperatures
              </h4>
              <div className='space-y-1.5'>
                {data.comp_temps
                  .sort((a, b) => a.label.localeCompare(b.label))
                  .map((c) => (
                    <div key={c.label} className='flex justify-between text-sm'>
                      <span className='text-muted-foreground'>{c.label}</span>
                      <span className='text-foreground text-nowrap'>
                        {c.temperature.toFixed(1)} °C
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </SystemCard>

        <SystemCard
          title={`GPU (${data.gpu_vendor})`}
          icon={<Monitor className='w-5 h-5' />}
        >
          <div className='space-y-3'>
            <div>
              <div className='flex justify-between items-center mb-1'>
                <span className='text-sm text-muted-foreground'>Usage</span>
                <span className='text-lg font-bold text-foreground text-nowrap'>
                  {data.gpu_usage}%
                </span>
              </div>
              <ProgressBar value={data.gpu_usage} />
            </div>

            <InfoItem
              label='Temperature'
              value={`${data.gpu_temp.toFixed(1)} °C`}
            />
          </div>
        </SystemCard>

        <SystemCard title='Memory' icon={<MemoryStick className='w-5 h-5' />}>
          <div className='space-y-3'>
            <div>
              <div className='flex justify-between items-center mb-1'>
                <span className='text-sm text-muted-foreground'>RAM</span>
                <span className='text-sm text-foreground text-nowrap'>
                  {(data.mem_used / 1024 ** 3).toFixed(2)} GB /{' '}
                  {(data.mem_total / 1024 ** 3).toFixed(2)} GB
                </span>
              </div>
              <ProgressBar
                value={(data.mem_used / data.mem_total) * 100}
                color='blue'
              />
            </div>

            <div>
              <div className='flex justify-between items-center mb-1'>
                <span className='text-sm text-muted-foreground'>Swap</span>
                <span className='text-sm text-foreground text-nowrap'>
                  {(data.swap_used / 1024 ** 3).toFixed(2)} GB /{' '}
                  {(data.swap_total / 1024 ** 3).toFixed(2)} GB
                </span>
              </div>
              <ProgressBar
                value={(data.swap_used / data.swap_total) * 100}
                color='purple'
              />
            </div>
          </div>
        </SystemCard>

        <SystemCard title='Disk' icon={<HardDrive className='w-5 h-5' />}>
          <div>
            <div className='flex justify-between items-center mb-1'>
              <span className='text-sm text-muted-foreground'>Storage</span>
              <span className='text-sm text-foreground text-nowrap'>
                {(data.disk_used / 1024 ** 3).toFixed(2)} GB /{' '}
                {(data.disk_total / 1024 ** 3).toFixed(2)} GB
              </span>
            </div>
            <ProgressBar
              value={(data.disk_used / data.disk_total) * 100}
              color='yellow'
            />
          </div>
        </SystemCard>

        <SystemCard title='Network' icon={<Network className='w-5 h-5' />}>
          <div className='space-y-2'>
            <InfoItem label='Received' value={formatBytes(data.net_in)} />
            <InfoItem label='Sent' value={formatBytes(data.net_out)} />
          </div>
        </SystemCard>

        <SystemCard title='Battery' icon={<Battery className='w-5 h-5' />}>
          <div className='space-y-3'>
            <div>
              <div className='flex justify-between items-center mb-1'>
                <span className='text-sm text-muted-foreground capitalize'>
                  {data.battery_status}
                </span>
                <span className='text-lg font-bold text-foreground text-nowrap'>
                  {data.battery_percent.toFixed(0)}%
                </span>
              </div>
              <ProgressBar value={data.battery_percent} color='green' />
            </div>

            {data.battery_hours_left >= 0 && data.battery_status !== 'full' && (
              <div className='text-sm text-muted-foreground text-nowrap'>
                {data.battery_status === 'charging'
                  ? `Time to 100%: ${data.battery_hours_left.toFixed(1)}h`
                  : `Time remaining: ${data.battery_hours_left.toFixed(1)}h`}
              </div>
            )}
          </div>
        </SystemCard>
      </div>
    </div>
  );
}

interface SystemCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

function SystemCard({ title, icon, children, className }: SystemCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardIcon>{icon}</CardIcon>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className='flex justify-between items-center'>
      <span className='text-sm text-muted-foreground'>{label}:</span>
      <span className='text-sm text-foreground font-medium text-nowrap'>
        {value}
      </span>
    </div>
  );
}

interface ProgressBarProps {
  value: number;
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'default';
}

function ProgressBar({ value, color = 'default' }: ProgressBarProps) {
  const colors = {
    default: 'bg-linear-to-r from-blue-600 to-purple-600',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className='w-full bg-secondary rounded-full h-2 overflow-hidden'>
      <div
        className={`h-full ${colors[color]} transition-all duration-300`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}
