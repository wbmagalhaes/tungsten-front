import { useMemo, useState } from 'react';
import {
  Wrench,
  Loader2,
  RefreshCw,
  RotateCcw,
  Power,
  AlertTriangle,
  Clock,
  CheckCircle,
  Package,
} from 'lucide-react';
import { Button } from '@components/base/button';
import { Badge } from '@components/base/badge';
import useCheckUpdates from '@hooks/system/use-check-updates';
import useApplyUpdates from '@hooks/system/use-apply-updates';
import useRebootSystem from '@hooks/system/use-reboot-system';
import useShutdownSystem from '@hooks/system/use-shutdown-system';
import { ConfirmationDialog } from '@components/ConfirmationDialog';
import { InformationDialog } from '@components/InformationDialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@components/base/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@components/base/tooltip';
import SystemCard from './SystemCard';
import ProtectedComponent from '@components/ProtectedComponent';

type PackageUpdate = {
  name: string;
  versionUpdate: string;
};

export default function SystemActionsSection() {
  const updates = useCheckUpdates();
  const applyUpdates = useApplyUpdates();
  const reboot = useRebootSystem();
  const shutdown = useShutdownSystem();

  const [showShutdownConfirm, setShowShutdownConfirm] = useState(false);
  const [showRebootConfirm, setShowRebootConfirm] = useState(false);
  const [showShutdownSuccess, setShowShutdownSuccess] = useState(false);
  const [showRebootSuccess, setShowRebootSuccess] = useState(false);

  const [showUpdatesDialog, setShowUpdatesDialog] = useState(false);
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [hasSeenUpdates, setHasSeenUpdates] = useState(false);

  const availablePackages: PackageUpdate[] = useMemo(() => {
    return (
      updates.data?.available
        ?.split('\n')
        .map((pkg) => {
          const split = pkg.trim().split(' ');
          if (split.length < 2) return null;
          const [name, ...rest] = split;
          return { name, versionUpdate: rest.join(' ') };
        })
        .filter((pkg) => pkg !== null) ?? []
    );
  }, [updates]);

  const hasUpdates = !!updates.data?.available;
  const showTooltip = hasUpdates && !hasSeenUpdates;

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

  const handleOpenUpdatesDialog = () => {
    setShowUpdatesDialog(true);
    setHasSeenUpdates(true);
    if (!hasUpdates) {
      updates.refetch();
    }
  };

  const handleCloseUpdatesDialog = () => {
    setShowUpdatesDialog(false);
    setSelectedPackages([]);
  };

  const togglePackage = (pkg: string) => {
    setSelectedPackages((prev) =>
      prev.includes(pkg) ? prev.filter((p) => p !== pkg) : [...prev, pkg],
    );
  };

  const toggleAll = () => {
    if (selectedPackages.length === availablePackages.length) {
      setSelectedPackages([]);
    } else {
      setSelectedPackages([...availablePackages.map((p) => p.name)]);
    }
  };

  const handleApplyUpdates = () => {
    applyUpdates.mutate(
      { packages: selectedPackages },
      {
        onSuccess: () => {
          handleCloseUpdatesDialog();
        },
      },
    );
  };

  return (
    <>
      <SystemCard
        title='System Actions'
        icon={<Wrench className='w-5 h-5' />}
        className='col-span-full'
      >
        <div className='flex flex-wrap gap-2'>
          <Tooltip open={showTooltip}>
            <TooltipTrigger
              render={(props) => (
                <Button
                  {...props}
                  size='sm'
                  variant='secondary'
                  onClick={handleOpenUpdatesDialog}
                  disabled={updates.isFetching}
                >
                  {updates.isFetching ? (
                    <Loader2 className='w-4 h-4 animate-spin' />
                  ) : (
                    <RefreshCw className='w-4 h-4' />
                  )}
                  {updates.isFetching ? 'Checking...' : 'Check Updates'}
                </Button>
              )}
            />
            <TooltipContent
              side='top'
              align='start'
              className='bg-warning text-warning-foreground'
            >
              New updates available!
            </TooltipContent>
          </Tooltip>

          <ProtectedComponent requireScope='system:Write'>
            <>
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
            </>
          </ProtectedComponent>
        </div>
      </SystemCard>

      <Dialog open={showUpdatesDialog} onOpenChange={handleCloseUpdatesDialog}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <Package className='w-5 h-5 text-primary' />
              System Updates
            </DialogTitle>
            <DialogDescription>
              Select packages to update. Click on a package to toggle selection.
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            {updates.isFetching ? (
              <div className='flex items-center justify-center py-12'>
                <div className='text-center'>
                  <Loader2 className='w-8 h-8 text-primary animate-spin mx-auto mb-2' />
                  <p className='text-sm text-muted-foreground'>
                    Checking for updates...
                  </p>
                </div>
              </div>
            ) : hasUpdates ? (
              <>
                <div>
                  <label className='text-sm text-muted-foreground mb-3 flex items-center gap-2'>
                    <Package className='w-4 h-4' />
                    Available Packages ({availablePackages.length})
                  </label>
                  <div className='flex flex-wrap gap-1 mb-2'>
                    {availablePackages.map((pkg) => (
                      <Badge
                        key={pkg.name}
                        variant={
                          selectedPackages.includes(pkg.name)
                            ? 'default'
                            : 'outline'
                        }
                        className='cursor-pointer justify-center py-2'
                        render={(props) => (
                          <button
                            {...props}
                            onClick={() => togglePackage(pkg.name)}
                          />
                        )}
                      >
                        {selectedPackages.includes(pkg.name) && (
                          <CheckCircle className='w-3 h-3' />
                        )}
                        {pkg.name} {pkg.versionUpdate}
                      </Badge>
                    ))}
                  </div>
                  <Badge
                    variant={
                      selectedPackages.length === availablePackages.length
                        ? 'default'
                        : 'outline'
                    }
                    className='cursor-pointer w-full justify-center py-2'
                    render={(props) => (
                      <button {...props} onClick={toggleAll} />
                    )}
                  >
                    {selectedPackages.length === availablePackages.length && (
                      <CheckCircle className='w-3 h-3' />
                    )}
                    Select All
                  </Badge>
                </div>

                <div className='text-sm text-muted-foreground'>
                  {selectedPackages.length === 0
                    ? 'No packages selected'
                    : `${selectedPackages.length} package${selectedPackages.length !== 1 ? 's' : ''} selected`}
                </div>
              </>
            ) : (
              <div className='text-center py-8'>
                <CheckCircle className='w-12 h-12 text-success mx-auto mb-3' />
                <p className='text-foreground font-medium mb-1'>
                  No updates available
                </p>
                <p className='text-sm text-muted-foreground'>
                  All packages are up to date
                </p>
              </div>
            )}
          </div>

          {hasUpdates && !updates.isFetching && (
            <DialogFooter>
              <Button variant='outline' onClick={handleCloseUpdatesDialog}>
                Cancel
              </Button>
              <Button
                onClick={handleApplyUpdates}
                disabled={
                  selectedPackages.length === 0 || applyUpdates.isPending
                }
              >
                {applyUpdates.isPending ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin' />
                    Applying Updates...
                  </>
                ) : (
                  <>
                    <RefreshCw className='w-4 h-4' />
                    Apply Updates
                  </>
                )}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

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
