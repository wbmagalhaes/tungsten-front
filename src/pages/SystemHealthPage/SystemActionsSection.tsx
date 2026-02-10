import { useState } from 'react';
import {
  Wrench,
  Loader2,
  RefreshCw,
  RotateCcw,
  Power,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { Button } from '@components/base/button';
import { Badge } from '@components/base/badge';
import useCheckUpdates from '@hooks/system/use-check-updates';
import useApplyUpdates from '@hooks/system/use-apply-updates';
import useRebootSystem from '@hooks/system/use-reboot-system';
import useShutdownSystem from '@hooks/system/use-shutdown-system';
import { ConfirmationDialog } from '@components/ConfirmationDialog';
import { InformationDialog } from '@components/InformationDialog';
import SystemCard from './SystemCard';

export default function SystemActionsSection() {
  const updates = useCheckUpdates();
  const applyUpdates = useApplyUpdates();

  const reboot = useRebootSystem();
  const shutdown = useShutdownSystem();

  const [showShutdownConfirm, setShowShutdownConfirm] = useState(false);
  const [showRebootConfirm, setShowRebootConfirm] = useState(false);
  const [showShutdownSuccess, setShowShutdownSuccess] = useState(false);
  const [showRebootSuccess, setShowRebootSuccess] = useState(false);

  const handleShutdown = () => {
    shutdown.mutate(undefined, {
      onSuccess: () => {
        setShowShutdownConfirm(false);
        setShowShutdownSuccess(true);
      },
    });
  };

  const handleReboot = () => {
    reboot.mutate(undefined, {
      onSuccess: () => {
        setShowRebootConfirm(false);
        setShowRebootSuccess(true);
      },
    });
  };

  return (
    <>
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
            {updates.isFetching ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <RefreshCw className='w-4 h-4' />
            )}
            {updates.isFetching ? 'Checking...' : 'Check Updates'}
          </Button>

          <Button
            size='sm'
            onClick={() => applyUpdates.mutate({})}
            disabled={applyUpdates.isPending}
          >
            {applyUpdates.isPending ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : null}
            {applyUpdates.isPending ? 'Updating...' : 'Apply Updates'}
          </Button>

          <Button
            size='sm'
            variant='secondary'
            onClick={() => setShowRebootConfirm(true)}
            disabled={reboot.isPending}
          >
            {reboot.isPending ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <RotateCcw className='w-4 h-4' />
            )}
            Reboot
          </Button>

          <Button
            size='sm'
            variant='destructive'
            onClick={() => setShowShutdownConfirm(true)}
            disabled={shutdown.isPending}
          >
            {shutdown.isPending ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <Power className='w-4 h-4' />
            )}
            Shutdown
          </Button>
        </div>

        {updates.data?.available && (
          <Badge variant='warning' className='mt-3'>
            Updates available: {updates.data.available}
          </Badge>
        )}
      </SystemCard>

      <ConfirmationDialog
        open={showShutdownConfirm}
        onOpenChange={setShowShutdownConfirm}
        title='Confirm Shutdown'
        description='The system will shutdown in 5 minutes. You will need to manually power it back on.'
        icon={<AlertTriangle className='w-5 h-5 text-destructive' />}
        confirmText='Confirm Shutdown'
        confirmVariant='destructive'
        onConfirm={handleShutdown}
        isLoading={shutdown.isPending}
        loadingText='Shutting down...'
      />

      <ConfirmationDialog
        open={showRebootConfirm}
        onOpenChange={setShowRebootConfirm}
        title='Confirm Reboot'
        description='The system will reboot in 5 minutes. The server will be temporarily unavailable during the restart.'
        icon={<AlertTriangle className='w-5 h-5 text-warning' />}
        confirmText='Confirm Reboot'
        confirmVariant='secondary'
        onConfirm={handleReboot}
        isLoading={reboot.isPending}
        loadingText='Rebooting...'
      />

      <InformationDialog
        open={showShutdownSuccess}
        onOpenChange={setShowShutdownSuccess}
        title='Shutdown Scheduled'
        description='The system will shutdown in 5 minutes. You will need to manually power it back on. Make sure to save any ongoing work.'
        icon={<Clock className='w-5 h-5 text-destructive' />}
        buttonText='I Understand'
      />

      <InformationDialog
        open={showRebootSuccess}
        onOpenChange={setShowRebootSuccess}
        title='Reboot Scheduled'
        description='The system will reboot in 5 minutes. The server will be back online shortly after the restart completes.'
        icon={<Clock className='w-5 h-5 text-primary' />}
        buttonText='I Understand'
      />
    </>
  );
}
