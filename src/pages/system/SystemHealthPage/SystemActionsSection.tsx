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
  Wifi,
  WifiOff,
  Lock,
  Eye,
  EyeOff,
  BookmarkCheck,
  Trash2,
} from 'lucide-react';
import { Button } from '@components/base/button';
import { Badge } from '@components/base/badge';
import { TextField } from '@components/base/text-field';
import { useCheckUpdates } from '@hooks/system/use-check-updates';
import { useApplyUpdates } from '@hooks/system/use-apply-updates';
import { useRebootSystem } from '@hooks/system/use-reboot-system';
import { useShutdownSystem } from '@hooks/system/use-shutdown-system';
import { useRebootIsScheduled } from '@hooks/system/use-reboot-is-scheduled';
import { useShutdownIsScheduled } from '@hooks/system/use-shutdown-is-scheduled';
import { useWifiScan } from '@hooks/system/use-wifi-scan';
import { useWifiConnect } from '@hooks/system/use-wifi-connect';
import { useWifiForget } from '@hooks/system/use-wifi-forget';
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
import type { WifiNetwork } from '@services/system.service';

type PackageUpdate = {
  name: string;
  versionUpdate: string;
};

export default function SystemActionsSection() {
  const updates = useCheckUpdates();
  const applyUpdates = useApplyUpdates();
  const reboot = useRebootSystem();
  const shutdown = useShutdownSystem();
  const rebootScheduled = useRebootIsScheduled();
  const shutdownScheduled = useShutdownIsScheduled();

  const [showShutdownConfirm, setShowShutdownConfirm] = useState(false);
  const [showRebootConfirm, setShowRebootConfirm] = useState(false);
  const [showShutdownSuccess, setShowShutdownSuccess] = useState(false);
  const [showRebootSuccess, setShowRebootSuccess] = useState(false);

  const [showUpdatesDialog, setShowUpdatesDialog] = useState(false);
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [hasSeenUpdates, setHasSeenUpdates] = useState(false);

  const [showWifiDialog, setShowWifiDialog] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<WifiNetwork | null>(
    null,
  );
  const [wifiPassword, setWifiPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [forgetting, setForgetting] = useState(false);

  const wifiScan = useWifiScan(showWifiDialog);
  const wifiConnect = useWifiConnect();
  const wifiForget = useWifiForget();

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
    if (!hasUpdates) updates.refetch();
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
      setSelectedPackages(availablePackages.map((p) => p.name));
    }
  };

  const handleApplyUpdates = () => {
    applyUpdates.mutate(
      { packages: selectedPackages },
      { onSuccess: handleCloseUpdatesDialog },
    );
  };

  const handleOpenWifiDialog = () => {
    setShowWifiDialog(true);
    setSelectedNetwork(null);
    setWifiPassword('');
  };

  const handleCloseWifiDialog = () => {
    setShowWifiDialog(false);
    setSelectedNetwork(null);
    setWifiPassword('');
    setShowPassword(false);
    setForgetting(false);
  };

  const handleSelectNetwork = (network: WifiNetwork) => {
    setSelectedNetwork(network);
    setWifiPassword('');
    setShowPassword(false);
    setForgetting(false);
  };

  const handleWifiForget = () => {
    if (!selectedNetwork) return;
    wifiForget.mutate(
      { ssid: selectedNetwork.ssid },
      {
        onSuccess: () => {
          setForgetting(false);
          setSelectedNetwork({ ...selectedNetwork, saved: false });
          setWifiPassword('');
        },
      },
    );
  };

  const handleWifiConnect = () => {
    if (!selectedNetwork) return;
    wifiConnect.mutate(
      {
        ssid: selectedNetwork.ssid,
        password:
          selectedNetwork.security && (!selectedNetwork.saved || forgetting)
            ? wifiPassword
            : undefined,
      },
      { onSuccess: handleCloseWifiDialog },
    );
  };

  const networks = wifiScan.data ?? [];

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
            <Button
              size='sm'
              variant='secondary'
              onClick={handleOpenWifiDialog}
            >
              <Wifi className='w-4 h-4' />
              Connect Wifi
            </Button>
          </ProtectedComponent>

          <ProtectedComponent requireScope='system:Write'>
            <>
              <Tooltip open={!!rebootScheduled.data?.scheduled}>
                <TooltipTrigger
                  render={(props) => (
                    <Button
                      {...props}
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
                      {rebootScheduled.data?.scheduled && (
                        <Clock className='w-3 h-3 text-warning' />
                      )}
                    </Button>
                  )}
                />
                {rebootScheduled.data?.scheduled && (
                  <TooltipContent
                    side='top'
                    className='bg-warning text-warning-foreground max-w-xs'
                  >
                    {rebootScheduled.data.detail ?? 'Reboot already scheduled'}
                  </TooltipContent>
                )}
              </Tooltip>

              <Tooltip open={!!shutdownScheduled.data?.scheduled}>
                <TooltipTrigger
                  render={(props) => (
                    <Button
                      {...props}
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
                      {shutdownScheduled.data?.scheduled && (
                        <Clock className='w-3 h-3' />
                      )}
                    </Button>
                  )}
                />
                {shutdownScheduled.data?.scheduled && (
                  <TooltipContent
                    side='top'
                    className='bg-destructive text-destructive-foreground max-w-xs'
                  >
                    {shutdownScheduled.data.detail ??
                      'Shutdown already scheduled'}
                  </TooltipContent>
                )}
              </Tooltip>
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

      <Dialog open={showWifiDialog} onOpenChange={handleCloseWifiDialog}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <Wifi className='w-5 h-5 text-primary' />
              Connect to WiFi
            </DialogTitle>
            <DialogDescription>
              {selectedNetwork
                ? `Enter credentials for "${selectedNetwork.ssid}"`
                : 'Select a network to connect to.'}
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-3'>
            {wifiScan.isFetching ? (
              <div className='flex items-center justify-center py-10'>
                <div className='text-center'>
                  <Loader2 className='w-7 h-7 text-primary animate-spin mx-auto mb-2' />
                  <p className='text-sm text-muted-foreground'>
                    Scanning networks...
                  </p>
                </div>
              </div>
            ) : networks.length === 0 ? (
              <div className='text-center py-8'>
                <WifiOff className='w-10 h-10 text-muted-foreground mx-auto mb-2' />
                <p className='text-sm text-muted-foreground'>
                  No networks found
                </p>
                <Button
                  variant='ghost'
                  size='sm'
                  className='mt-2'
                  onClick={() => wifiScan.refetch()}
                >
                  <RefreshCw className='w-3 h-3' />
                  Retry
                </Button>
              </div>
            ) : !selectedNetwork ? (
              <div className='space-y-1 max-h-72 overflow-y-auto'>
                {networks
                  .sort((a, b) => b.signal - a.signal)
                  .map((network) => (
                    <button
                      key={network.ssid}
                      onClick={() => handleSelectNetwork(network)}
                      className={`w-full flex items-center justify-between p-3 rounded-sm hover:bg-muted/50 transition-colors text-left ${network.connected ? 'bg-primary/5 border border-primary/20 rounded-sm' : ''}`}
                    >
                      <div className='flex items-center gap-2 min-w-0'>
                        <Wifi
                          className={`w-4 h-4 shrink-0 ${network.connected ? 'text-primary' : 'text-muted-foreground'}`}
                        />
                        <span className='text-sm font-medium truncate'>
                          {network.ssid}
                        </span>
                        {network.security && (
                          <Lock className='w-3 h-3 text-muted-foreground shrink-0' />
                        )}
                        {network.saved && (
                          <BookmarkCheck className='w-3 h-3 text-success shrink-0' />
                        )}
                      </div>
                      <div className='flex items-center gap-2 shrink-0 ml-2'>
                        {network.connected && (
                          <span className='text-xs text-primary font-medium'>
                            Connected
                          </span>
                        )}
                        <SignalBadge signal={network.signal} />
                      </div>
                    </button>
                  ))}
              </div>
            ) : (
              <div className='space-y-4'>
                <button
                  onClick={() => setSelectedNetwork(null)}
                  className='flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors'
                >
                  ← Back to networks
                </button>
                <div className='flex items-center gap-3 p-3 rounded-sm bg-muted/30'>
                  <Wifi
                    className={`w-4 h-4 ${selectedNetwork.connected ? 'text-primary' : ''}`}
                  />
                  <span className='text-sm font-medium'>
                    {selectedNetwork.ssid}
                  </span>
                  {selectedNetwork.security && (
                    <Lock className='w-3 h-3 text-muted-foreground' />
                  )}
                  {selectedNetwork.saved && (
                    <BookmarkCheck className='w-3 h-3 text-success' />
                  )}
                  {selectedNetwork.connected && (
                    <span className='text-xs text-primary font-medium ml-auto'>
                      Connected
                    </span>
                  )}
                  <SignalBadge signal={selectedNetwork.signal} />
                </div>

                {selectedNetwork.security &&
                selectedNetwork.saved &&
                !forgetting ? (
                  <div className='flex items-center justify-between rounded-sm bg-success/10 border border-success/20 px-3 py-2'>
                    <div className='flex items-center gap-2 text-sm text-success'>
                      <BookmarkCheck className='w-4 h-4' />
                      Password saved
                    </div>
                    <button
                      type='button'
                      onClick={() => setForgetting(true)}
                      className='flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors'
                    >
                      <Trash2 className='w-3 h-3' />
                      Forget
                    </button>
                  </div>
                ) : selectedNetwork.security ? (
                  <div className='relative'>
                    {forgetting && (
                      <p className='text-xs text-muted-foreground mb-2'>
                        Enter a new password to reconnect, or{' '}
                        <button
                          type='button'
                          onClick={handleWifiForget}
                          disabled={wifiForget.isPending}
                          className='text-destructive hover:underline'
                        >
                          {wifiForget.isPending
                            ? 'Forgetting…'
                            : 'just forget this network'}
                        </button>
                        .
                      </p>
                    )}
                    <TextField
                      label='Password'
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Network password'
                      value={wifiPassword}
                      onChange={(e) => setWifiPassword(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && handleWifiConnect()
                      }
                      autoFocus
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword((v) => !v)}
                      className='absolute right-3 top-8 text-muted-foreground hover:text-foreground transition-colors'
                    >
                      {showPassword ? (
                        <EyeOff className='w-4 h-4' />
                      ) : (
                        <Eye className='w-4 h-4' />
                      )}
                    </button>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {selectedNetwork && (
            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setSelectedNetwork(null)}
              >
                Back
              </Button>
              <Button
                onClick={handleWifiConnect}
                disabled={
                  wifiConnect.isPending ||
                  wifiForget.isPending ||
                  (selectedNetwork.security !== '' &&
                    (!selectedNetwork.saved || forgetting) &&
                    !wifiPassword.trim())
                }
              >
                {wifiConnect.isPending ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin' />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wifi className='w-4 h-4' />
                    Connect
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

function SignalBadge({ signal }: { signal: number }) {
  const color =
    signal >= 70
      ? 'text-success'
      : signal >= 40
        ? 'text-warning'
        : 'text-destructive';
  return (
    <span className={`text-xs font-mono ml-auto ${color}`}>{signal}%</span>
  );
}
