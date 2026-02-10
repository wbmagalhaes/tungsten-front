import {
  Cpu,
  HardDrive,
  MemoryStick,
  Network,
  Battery,
  Monitor,
  Server,
} from 'lucide-react';
import useHealthCheck from '@hooks/system/use-health-check';
import formatBytes from '@utils/formatBytes';
import formatTime from '@utils/formatTime';
import ProtectedComponent from '@components/ProtectedComponent';
import { LoadingState } from '@components/LoadingState';
import { ErrorState } from '@components/ErrorState';
import { RefetchingIndicator } from '@components/RefetchingIndicator';
import SystemCard from './SystemCard';
import InfoItem from './InfoItem';
import ProgressBar from '@components/ProgressBar';
import SystemActionsSection from './SystemActionsSection';

export default function SystemHealthPage() {
  const { data, isLoading, error, isRefetching } = useHealthCheck();

  if (isLoading) {
    return <LoadingState message='Loading system data...' />;
  }

  if (error || !data) {
    return (
      <ErrorState
        title='Error loading system data'
        message={error?.message || 'Unable to fetch system health information'}
      />
    );
  }

  return (
    <div className='space-y-4'>
      {isRefetching && <RefetchingIndicator />}

      <ProtectedComponent requireScope='system:Write'>
        <SystemActionsSection />
      </ProtectedComponent>

      <SystemCard
        title='System'
        icon={<Server className='w-5 h-5' />}
        className='col-span-full'
      >
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:divide-x divide-border'>
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
            <div className='flex flex-col gap-1'>
              <InfoItem label='Usage' value={`${data.cpu_usage.toFixed(1)}%`} />
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
                    <InfoItem
                      key={c.label}
                      label={c.label}
                      value={`${c.temperature.toFixed(1)} °C`}
                    />
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
            <div className='flex flex-col gap-1'>
              <InfoItem label='Usage' value={`${data.gpu_usage}%`} />
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
            <div className='flex flex-col gap-1'>
              <InfoItem
                label='RAM'
                value={`${(data.mem_used / 1024 ** 3).toFixed(2)} GB / ${(data.mem_total / 1024 ** 3).toFixed(2)} GB`}
              />
              <ProgressBar
                value={(data.mem_used / data.mem_total) * 100}
                color='blue'
              />
            </div>

            <div className='flex flex-col gap-1'>
              <InfoItem
                label='Swap'
                value={`${(data.swap_used / 1024 ** 3).toFixed(2)} GB / ${(data.swap_total / 1024 ** 3).toFixed(2)} GB`}
              />
              <ProgressBar
                value={(data.swap_used / data.swap_total) * 100}
                color='purple'
              />
            </div>
          </div>
        </SystemCard>

        <SystemCard title='Disk' icon={<HardDrive className='w-5 h-5' />}>
          <div className='flex flex-col gap-1'>
            <InfoItem
              label='Storage'
              value={`${(data.disk_used / 1024 ** 3).toFixed(2)} GB / ${(data.disk_total / 1024 ** 3).toFixed(2)} GB`}
            />
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
            <div className='flex flex-col gap-1'>
              <InfoItem
                label={<span className='capitalize'>data.battery_status</span>}
                value={`${data.battery_percent.toFixed(0)}%`}
              />
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
