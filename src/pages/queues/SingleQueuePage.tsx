import { useParams } from 'react-router-dom';
import { useState } from 'react';
import {
  ArrowLeft,
  Layers,
  Send,
  Loader2,
  Trash2,
  RefreshCcw,
  Shield,
  UserPlus,
  Radio,
  RadioTower,
  Check,
  X,
  Clock,
  Pencil,
  Save,
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
import { Badge } from '@components/base/badge';
import { TextField } from '@components/base/text-field';
import { Textarea } from '@components/base/text-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/base/select';
import { LoadingState } from '@components/LoadingState';
import { ErrorState } from '@components/ErrorState';
import ProtectedComponent from '@components/ProtectedComponent';

import { useGetQueue } from '@hooks/queues/use-get-queue';
import { useUpdateQueue } from '@hooks/queues/use-update-queue';
import { useListMessages } from '@hooks/queues/use-list-messages';
import { useSendMessage } from '@hooks/queues/use-send-message';
import { useQueueStream } from '@hooks/queues/use-queue-stream';
import {
  useQueueGrants,
  useCreateQueueGrant,
  useDeleteQueueGrant,
} from '@hooks/queues/use-queue-grants';
import {
  useAckMessage,
  useNackMessage,
  useSetMessageVisibility,
} from '@hooks/queues/use-message-actions';
import { purgeQueue, redriveQueue, type Queue } from '@services/queues.service';

const QUEUE_PERMS = ['read', 'write', 'admin'];

function EditSection({
  queue,
  onSaved,
}: {
  queue: Queue;
  onSaved: () => void;
}) {
  const update = useUpdateQueue(queue.id);
  const [name, setName] = useState(queue.name);
  const [visibilityTimeout, setVisibilityTimeout] = useState(
    queue.visibility_timeout,
  );
  const [maxReceiveCount, setMaxReceiveCount] = useState(
    queue.max_receive_count,
  );

  const handleSave = () => {
    update.mutate(
      {
        name,
        visibility_timeout: visibilityTimeout,
        max_receive_count: maxReceiveCount,
      },
      { onSuccess: () => onSaved() },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardIcon>
          <Pencil className='w-5 h-5' />
        </CardIcon>
        <CardTitle>Edit Queue</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <TextField
          label='Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label='Visibility timeout (seconds)'
          type='number'
          value={visibilityTimeout}
          onChange={(e) =>
            setVisibilityTimeout(Number(e.target.value) || 0)
          }
        />
        <TextField
          label='Max receive count'
          type='number'
          value={maxReceiveCount}
          onChange={(e) => setMaxReceiveCount(Number(e.target.value) || 0)}
        />
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={update.isPending}>
          {update.isPending ? (
            <Loader2 className='w-4 h-4 animate-spin' />
          ) : (
            <Save className='w-4 h-4' />
          )}
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function SingleQueuePage() {
  const { id = '' } = useParams();
  const { data: queue, isLoading, error } = useGetQueue(id);
  const { data: messagesPage, refetch } = useListMessages(id);
  const messages = messagesPage?.results;
  const send = useSendMessage(id);
  const ack = useAckMessage(id);
  const nack = useNackMessage(id);
  const setVisibility = useSetMessageVisibility(id);
  const { data: grantsPage } = useQueueGrants(id);
  const createGrant = useCreateQueueGrant(id);
  const deleteGrant = useDeleteQueueGrant(id);

  const [subscribed, setSubscribed] = useState(false);
  useQueueStream(id, subscribed);
  const [showEdit, setShowEdit] = useState(false);

  const [payload, setPayload] = useState('');
  const [grantUserId, setGrantUserId] = useState('');
  const [grantPerm, setGrantPerm] = useState(QUEUE_PERMS[0]);

  if (isLoading) return <LoadingState message='Loading queue…' />;
  if (error || !queue) {
    return (
      <ErrorState
        title='Queue not found'
        message={error?.message || 'Unable to load this queue'}
      />
    );
  }

  const grants = grantsPage?.results ?? [];

  const handleSend = () => {
    if (!payload.trim()) return;
    send.mutate({ payload }, { onSuccess: () => setPayload('') });
  };

  const handleExtend = (receiptHandle: string) => {
    setVisibility.mutate({
      receiptHandle,
      visibilityTimeout: queue.visibility_timeout,
    });
  };

  const handleAddGrant = () => {
    if (!grantUserId.trim()) return;
    createGrant.mutate(
      { user_id: grantUserId, permission: grantPerm },
      { onSuccess: () => setGrantUserId('') },
    );
  };

  return (
    <div className='space-y-4 max-w-3xl mx-auto'>
      <ButtonLink to='/queues' variant='link' className='p-0' size='sm'>
        <ArrowLeft className='w-4 h-4' />
        Back to queues
      </ButtonLink>

      <Card>
        <CardHeader className='gap-3'>
          <CardIcon>
            <Layers className='w-5 h-5' />
          </CardIcon>
          <div className='flex flex-col items-start gap-1 flex-1'>
            <CardTitle>{queue.name}</CardTitle>
            <div className='flex gap-2 flex-wrap'>
              <Badge variant='outline'>vt {queue.visibility_timeout}s</Badge>
              <Badge variant='outline'>
                max-recv {queue.max_receive_count}
              </Badge>
            </div>
            <span className='text-xs text-muted-foreground font-mono'>
              {queue.id}
            </span>
          </div>
          <ProtectedComponent requireScope='wqs:queue:Edit'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setShowEdit((v) => !v)}
            >
              <Pencil className='w-4 h-4' />
              Edit
            </Button>
          </ProtectedComponent>
        </CardHeader>
        <CardFooter className='gap-2 flex-wrap'>
          <ProtectedComponent requireScope='wqs:queue:Subscribe'>
            <Button
              variant={subscribed ? 'destructive' : 'secondary'}
              size='sm'
              onClick={() => setSubscribed((v) => !v)}
            >
              {subscribed ? (
                <>
                  <RadioTower className='w-4 h-4 animate-pulse' />
                  Unsubscribe
                </>
              ) : (
                <>
                  <Radio className='w-4 h-4' />
                  Subscribe
                </>
              )}
            </Button>
          </ProtectedComponent>
          <ProtectedComponent requireScope='wqs:queue:Purge'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => purgeQueue(id).then(() => refetch())}
            >
              <Trash2 className='w-4 h-4' />
              Purge
            </Button>
          </ProtectedComponent>
          <ProtectedComponent requireScope='wqs:queue:Redrive'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => redriveQueue(id).then(() => refetch())}
            >
              <RefreshCcw className='w-4 h-4' />
              Redrive
            </Button>
          </ProtectedComponent>
        </CardFooter>
      </Card>

      {showEdit && (
        <EditSection queue={queue} onSaved={() => setShowEdit(false)} />
      )}

      <ProtectedComponent requireScope='wqs:queue:Send'>
        <Card>
          <CardHeader>
            <CardIcon>
              <Send className='w-5 h-5' />
            </CardIcon>
            <CardTitle>Send Message</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder='Message payload…'
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              className='min-h-24 font-mono text-sm'
            />
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleSend}
              disabled={!payload.trim() || send.isPending}
            >
              {send.isPending ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                <Send className='w-4 h-4' />
              )}
              Send
            </Button>
          </CardFooter>
        </Card>
      </ProtectedComponent>

      <Card>
        <CardHeader>
          <CardIcon>
            <Layers className='w-5 h-5' />
          </CardIcon>
          <CardTitle>Messages ({messages?.length ?? 0})</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          {!messages?.length ? (
            <p className='text-sm text-muted-foreground text-center py-4'>
              No visible messages.
            </p>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className='p-3 bg-muted/30 border border-border rounded-sm space-y-2'
              >
                <div className='flex gap-2 items-center text-xs text-muted-foreground flex-wrap'>
                  <span className='font-mono'>{m.id.slice(0, 8)}</span>
                  <Badge variant='outline' className='text-[10px]'>
                    {m.status}
                  </Badge>
                  <span>· received {m.receive_count}x</span>
                  {m.visibility_expires_at && (
                    <span className='ml-auto font-mono'>
                      visible until{' '}
                      {new Date(m.visibility_expires_at).toLocaleTimeString()}
                    </span>
                  )}
                </div>
                <pre className='text-sm font-mono whitespace-pre-wrap'>
                  {m.payload}
                </pre>
                {m.receipt_handle && (
                  <ProtectedComponent requireScope='wqs:queue:Subscribe'>
                    <div className='flex gap-2 pt-1 border-t border-border'>
                      <Button
                        size='sm'
                        variant='secondary'
                        onClick={() => ack.mutate(m.receipt_handle!)}
                        disabled={ack.isPending}
                      >
                        <Check className='w-4 h-4' />
                        Ack
                      </Button>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => nack.mutate(m.receipt_handle!)}
                        disabled={nack.isPending}
                      >
                        <X className='w-4 h-4' />
                        Nack
                      </Button>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => handleExtend(m.receipt_handle!)}
                        disabled={setVisibility.isPending}
                      >
                        <Clock className='w-4 h-4' />
                        Extend
                      </Button>
                    </div>
                  </ProtectedComponent>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <ProtectedComponent requireScope='wqs:queue:Grant'>
        <Card>
          <CardHeader>
            <CardIcon>
              <Shield className='w-5 h-5' />
            </CardIcon>
            <CardTitle>Grants ({grants.length})</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            {!grants.length ? (
              <p className='text-sm text-muted-foreground'>No grants yet.</p>
            ) : (
              <div className='space-y-2'>
                {grants.map((g) => (
                  <div
                    key={`${g.user_id}-${g.permission}`}
                    className='flex items-center gap-2 p-2 bg-muted/30 rounded-sm border border-border'
                  >
                    <span className='font-mono text-xs truncate flex-1'>
                      {g.user_id}
                    </span>
                    <Badge variant='outline'>{g.permission}</Badge>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-destructive'
                      onClick={() =>
                        deleteGrant.mutate({
                          userId: g.user_id,
                          permission: g.permission,
                        })
                      }
                    >
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className='flex flex-wrap items-end gap-2 pt-2 border-t border-border'>
              <div className='flex-1 min-w-40'>
                <TextField
                  label='User ID'
                  value={grantUserId}
                  onChange={(e) => setGrantUserId(e.target.value)}
                  placeholder='user uuid'
                />
              </div>
              <div>
                <label className='text-sm font-medium block mb-1'>
                  Permission
                </label>
                <Select
                  value={grantPerm}
                  onValueChange={(v) => v && setGrantPerm(v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {QUEUE_PERMS.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleAddGrant}
                disabled={!grantUserId.trim() || createGrant.isPending}
              >
                {createGrant.isPending ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <UserPlus className='w-4 h-4' />
                )}
                Grant
              </Button>
            </div>
          </CardContent>
        </Card>
      </ProtectedComponent>
    </div>
  );
}
