import { useState } from 'react';
import {
  Send,
  Plus,
  Loader2,
  Trash2,
  ShieldCheck,
  Power,
  RefreshCcw,
  Copy,
  Check,
  Bell,
  Pencil,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardIcon,
  CardTitle,
  CardFooter,
} from '@components/base/card';
import { Button } from '@components/base/button';
import { Badge } from '@components/base/badge';
import { TextField } from '@components/base/text-field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/base/select';
import PageHeader from '@components/PageHeader';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@components/base/dialog';
import ProtectedComponent from '@components/ProtectedComponent';
import {
  useRecipients,
  useCreateRecipient,
  useUpdateRecipient,
  useDeleteRecipient,
} from '@hooks/notifications/use-recipients';
import {
  useVerifyRecipient,
  useSetRecipientDisabled,
  useRotateRecipientSecret,
} from '@hooks/notifications/use-recipient-actions';
import {
  useEnablePushSubscription,
  isPushSupported,
} from '@hooks/notifications/use-push-subscription';
import type {
  Recipient,
  RecipientKind,
} from '@services/notifications.service';

const CHANNELS: RecipientKind[] = [
  'email',
  'sms',
  'push',
  'webhook',
  'in_app',
];

function VerifyDialog({
  recipient,
  onClose,
}: {
  recipient: Recipient | null;
  onClose: () => void;
}) {
  const verify = useVerifyRecipient();
  const [code, setCode] = useState('');

  const handleVerify = () => {
    if (!recipient) return;
    verify.mutate(
      { id: recipient.id, code: code || undefined },
      { onSuccess: () => onClose() },
    );
  };

  return (
    <Dialog open={!!recipient} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verify Recipient</DialogTitle>
          <DialogDescription>
            Enter the code sent to{' '}
            <span className='font-mono'>{recipient?.address}</span>, or leave
            blank to (re)trigger sending one.
          </DialogDescription>
        </DialogHeader>
        <TextField
          label='Verification code'
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder='123456'
        />
        {verify.isError && (
          <p className='text-sm text-destructive'>{verify.error.message}</p>
        )}
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleVerify} disabled={verify.isPending}>
            {verify.isPending ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <ShieldCheck className='w-4 h-4' />
            )}
            {code ? 'Verify' : 'Send code'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RotatedSecretDialog({
  secret,
  onClose,
}: {
  secret: string | null;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!secret) return;
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={!!secret} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Webhook Secret</DialogTitle>
          <DialogDescription>
            Copy this secret now. It will not be shown again.
          </DialogDescription>
        </DialogHeader>
        <div className='flex items-center gap-2 bg-muted rounded-sm p-3 font-mono text-sm break-all'>
          <span className='flex-1 select-all'>{secret}</span>
          <Button variant='ghost' size='icon' onClick={handleCopy}>
            {copied ? (
              <Check className='w-4 h-4 text-success' />
            ) : (
              <Copy className='w-4 h-4' />
            )}
          </Button>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function RecipientsPage() {
  return (
    <div className='space-y-4'>
      <PageHeader title='Recipients' icon={<Send className='w-5 h-5' />} />
      <RecipientsSection />
    </div>
  );
}

export function RecipientsSection() {
  const { data, isLoading } = useRecipients();
  const create = useCreateRecipient();
  const del = useDeleteRecipient();
  const setDisabled = useSetRecipientDisabled();
  const rotate = useRotateRecipientSecret();
  const updateRecipient = useUpdateRecipient();
  const enablePush = useEnablePushSubscription();

  const [open, setOpen] = useState(false);
  const [channel, setChannel] = useState<RecipientKind>('email');
  const [address, setAddress] = useState('');
  const [verifying, setVerifying] = useState<Recipient | null>(null);
  const [rotatedSecret, setRotatedSecret] = useState<string | null>(null);
  const [editing, setEditing] = useState<Recipient | null>(null);
  const [editAddress, setEditAddress] = useState('');

  const recipients = data?.results ?? [];

  const handleCreate = () => {
    if (!address.trim()) return;
    create.mutate(
      { kind: channel, address },
      {
        onSuccess: () => {
          setAddress('');
          setOpen(false);
        },
      },
    );
  };

  const handleRotate = (id: string) => {
    rotate.mutate(id, {
      onSuccess: (data) => setRotatedSecret(data.secret),
    });
  };

  return (
    <div className='space-y-4'>
      <ProtectedComponent requireScope='was:recipient:Create'>
        <div className='flex justify-end'>
          <Button onClick={() => setOpen(true)} size='sm'>
            <Plus className='w-4 h-4' />
            New Recipient
          </Button>
        </div>
      </ProtectedComponent>

      {isPushSupported() && (
        <ProtectedComponent requireScope='was:recipient:Create'>
          <Button
            variant='secondary'
            onClick={() => enablePush.mutate()}
            disabled={enablePush.isPending}
          >
            {enablePush.isPending ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <Bell className='w-4 h-4' />
            )}
            {enablePush.isPending
              ? enablePush.stage === 'permission'
                ? 'Requesting permission…'
                : enablePush.stage === 'subscribing'
                  ? 'Subscribing…'
                  : 'Registering…'
              : 'Enable browser push'}
          </Button>
        </ProtectedComponent>
      )}

      {enablePush.isError && (
        <p className='text-sm text-destructive'>{enablePush.error.message}</p>
      )}

      {isLoading && <p className='text-sm text-muted-fg'>Loading…</p>}

      <div className='space-y-3'>
        {recipients.map((r) => (
          <Card key={r.id}>
            <CardHeader>
              <CardIcon>
                <Send className='w-5 h-5' />
              </CardIcon>
              <div className='flex-1 min-w-0'>
                <CardTitle className='flex items-center gap-2 flex-wrap'>
                  <Badge variant='outline'>{r.kind}</Badge>
                  <span className='font-mono text-sm truncate'>
                    {r.address}
                  </span>
                  {r.verified ? (
                    <Badge variant='success'>
                      <ShieldCheck className='w-3 h-3' />
                      verified
                    </Badge>
                  ) : (
                    <Badge variant='warning'>unverified</Badge>
                  )}
                  {r.disabled && <Badge variant='warning'>disabled</Badge>}
                </CardTitle>
              </div>
            </CardHeader>
            <CardFooter className='gap-2'>
              {!r.verified && (
                <ProtectedComponent requireScope='was:recipient:Verify'>
                  <Button
                    variant='secondary'
                    size='sm'
                    onClick={() => setVerifying(r)}
                  >
                    <ShieldCheck className='w-4 h-4' />
                    Verify
                  </Button>
                </ProtectedComponent>
              )}
              <ProtectedComponent requireScope='was:recipient:Edit'>
                <>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      setEditing(r);
                      setEditAddress(r.address);
                    }}
                  >
                    <Pencil className='w-4 h-4' />
                    Edit
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() =>
                      setDisabled.mutate({ id: r.id, disabled: !r.disabled })
                    }
                    disabled={setDisabled.isPending}
                  >
                    <Power className='w-4 h-4' />
                    {r.disabled ? 'Enable' : 'Disable'}
                  </Button>
                </>
              </ProtectedComponent>
              {r.kind === 'webhook' && (
                <ProtectedComponent requireScope='was:recipient:Edit'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handleRotate(r.id)}
                    disabled={rotate.isPending}
                  >
                    <RefreshCcw className='w-4 h-4' />
                    Rotate secret
                  </Button>
                </ProtectedComponent>
              )}
              <ProtectedComponent requireScope='was:recipient:Delete'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='text-destructive ml-auto'
                  onClick={() => del.mutate(r.id)}
                >
                  <Trash2 className='w-4 h-4' />
                </Button>
              </ProtectedComponent>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Recipient</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <label className='text-sm font-medium block mb-1'>Channel</label>
              <Select
                value={channel}
                onValueChange={(v) => v && setChannel(v as RecipientKind)}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CHANNELS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <TextField
              label='Address'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!address.trim() || create.isPending}
            >
              {create.isPending ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                <Plus className='w-4 h-4' />
              )}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editing}
        onOpenChange={(o) => !o && setEditing(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Recipient</DialogTitle>
          </DialogHeader>
          <TextField
            label='Address'
            value={editAddress}
            onChange={(e) => setEditAddress(e.target.value)}
            required
          />
          <DialogFooter>
            <Button variant='outline' onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                editing &&
                updateRecipient.mutate(
                  { id: editing.id, address: editAddress },
                  { onSuccess: () => setEditing(null) },
                )
              }
              disabled={!editAddress.trim() || updateRecipient.isPending}
            >
              {updateRecipient.isPending ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                <Pencil className='w-4 h-4' />
              )}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <VerifyDialog
        recipient={verifying}
        onClose={() => setVerifying(null)}
      />
      <RotatedSecretDialog
        secret={rotatedSecret}
        onClose={() => setRotatedSecret(null)}
      />
    </div>
  );
}
