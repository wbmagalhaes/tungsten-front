import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import {
  ArrowLeft,
  Megaphone,
  Send,
  Loader2,
  UserPlus,
  Trash2,
  Users,
  Shield,
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
import { LoadingState } from '@components/LoadingState';
import { ErrorState } from '@components/ErrorState';
import ProtectedComponent from '@components/ProtectedComponent';

import { useGetTopic } from '@hooks/notifications/use-get-topic';
import {
  useSendToTopic,
  useUpdateTopic,
} from '@hooks/notifications/use-topics';
import {
  useTopicSubscriptions,
  useSubscribeTopic,
  useUnsubscribeTopic,
} from '@hooks/notifications/use-topic-subscriptions';
import {
  useTopicPermissions,
  useCreateTopicPermission,
  useDeleteTopicPermission,
} from '@hooks/notifications/use-topic-permissions';
import { useRecipients } from '@hooks/notifications/use-recipients';

export default function SingleTopicPage() {
  const { id = '' } = useParams();
  const { data: topic, isLoading, error } = useGetTopic(id);
  const { data: subscriptions } = useTopicSubscriptions(id);
  const { data: recipientsPage } = useRecipients();
  const send = useSendToTopic(id);
  const update = useUpdateTopic(id);
  const subscribe = useSubscribeTopic(id);
  const unsubscribe = useUnsubscribeTopic(id);
  const { data: permsPage } = useTopicPermissions(id);
  const createPerm = useCreateTopicPermission(id);
  const deletePerm = useDeleteTopicPermission(id);

  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [permUserId, setPermUserId] = useState('');
  const [permName, setPermName] = useState('Send');
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDiscoverable, setEditDiscoverable] = useState(false);

  if (isLoading) return <LoadingState message='Loading topic…' />;
  if (error || !topic) {
    return (
      <ErrorState
        title='Topic not found'
        message={error?.message || 'Unable to load this topic'}
      />
    );
  }

  const recipients = recipientsPage?.results ?? [];
  const subscriptionList = subscriptions?.results ?? [];
  const subscribedIds = new Set(subscriptionList.map((s) => s.recipient_id));
  const availableRecipients = recipients.filter(
    (r) => !subscribedIds.has(r.id),
  );

  const handleSend = () => {
    if (!subject.trim() || !body.trim()) return;
    send.mutate(
      { subject, body },
      {
        onSuccess: () => {
          setSubject('');
          setBody('');
        },
      },
    );
  };

  const handleSubscribe = () => {
    if (!recipientId) return;
    subscribe.mutate(recipientId, {
      onSuccess: () => setRecipientId(''),
    });
  };

  const handleAddPermission = () => {
    if (!permUserId.trim()) return;
    createPerm.mutate(
      { user_id: permUserId, permission: permName },
      { onSuccess: () => setPermUserId('') },
    );
  };

  const permissions = permsPage?.results ?? [];

  const recipientLabel = (rid: string) => {
    const r = recipients.find((x) => x.id === rid);
    return r ? `${r.kind}: ${r.address}` : rid;
  };

  return (
    <div className='space-y-4 max-w-3xl mx-auto'>
      <ButtonLink to='/topics' variant='link' className='p-0' size='sm'>
        <ArrowLeft className='w-4 h-4' />
        Back to topics
      </ButtonLink>

      <Card>
        <CardHeader className='gap-3'>
          <CardIcon>
            <Megaphone className='w-5 h-5' />
          </CardIcon>
          <div className='flex flex-col items-start gap-1 flex-1'>
            <CardTitle className='flex items-center gap-2'>
              {topic.name}
              {topic.is_system && <Badge variant='secondary'>system</Badge>}
              {topic.discoverable && (
                <Badge variant='outline'>discoverable</Badge>
              )}
            </CardTitle>
            {topic.description && (
              <p className='text-sm text-muted-foreground'>
                {topic.description}
              </p>
            )}
            <span className='text-xs text-muted-foreground font-mono'>
              {topic.id}
            </span>
          </div>
          <ProtectedComponent requireScope='was:topic:Edit'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => {
                setEditName(topic.name);
                setEditDescription(topic.description ?? '');
                setEditDiscoverable(topic.discoverable);
                setEditing(true);
              }}
            >
              <Pencil className='w-4 h-4' />
              Edit
            </Button>
          </ProtectedComponent>
        </CardHeader>
      </Card>

      {editing && (
        <Card>
          <CardHeader>
            <CardIcon>
              <Pencil className='w-5 h-5' />
            </CardIcon>
            <CardTitle>Edit Topic</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <TextField
              label='Name'
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <TextField
              label='Description'
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
            <label className='flex items-center gap-2 text-sm'>
              <input
                type='checkbox'
                checked={editDiscoverable}
                onChange={(e) => setEditDiscoverable(e.target.checked)}
              />
              Discoverable (visible to all users)
            </label>
          </CardContent>
          <CardContent className='flex gap-2 pt-0'>
            <Button
              onClick={() =>
                update.mutate(
                  {
                    name: editName,
                    description: editDescription,
                    discoverable: editDiscoverable,
                  },
                  { onSuccess: () => setEditing(false) },
                )
              }
              disabled={update.isPending}
            >
              {update.isPending ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                <Save className='w-4 h-4' />
              )}
              Save
            </Button>
            <Button variant='outline' onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </CardContent>
        </Card>
      )}

      <ProtectedComponent requireScope='was:topic:Send'>
        <Card>
          <CardHeader>
            <CardIcon>
              <Send className='w-5 h-5' />
            </CardIcon>
            <CardTitle>Send</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <TextField
              label='Subject'
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
            <div>
              <label className='text-sm font-medium block mb-1'>Body</label>
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className='min-h-24'
              />
            </div>
            {send.isError && (
              <p className='text-sm text-destructive'>{send.error.message}</p>
            )}
            {send.isSuccess && (
              <p className='text-sm text-success'>Sent to subscribers.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleSend}
              disabled={!subject.trim() || !body.trim() || send.isPending}
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
            <Users className='w-5 h-5' />
          </CardIcon>
          <CardTitle>Subscribers ({subscriptionList.length})</CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          {subscriptionList.length === 0 ? (
            <p className='text-sm text-muted-foreground'>
              No subscribers yet.
            </p>
          ) : (
            <div className='space-y-2'>
              {subscriptionList.map((s) => (
                <div
                  key={s.recipient_id}
                  className='flex items-center gap-2 p-2 bg-muted/30 rounded-sm border border-border'
                >
                  <span className='text-sm truncate flex-1'>
                    {recipientLabel(s.recipient_id)}
                  </span>
                  <ProtectedComponent requireScope='was:subscriber:Delete'>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-destructive'
                      onClick={() => unsubscribe.mutate(s.recipient_id)}
                    >
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </ProtectedComponent>
                </div>
              ))}
            </div>
          )}

          <ProtectedComponent requireScope='was:subscriber:Create'>
            <div className='pt-2 border-t border-border space-y-2'>
              {recipients.length === 0 ? (
                <p className='text-sm text-muted-foreground'>
                  You don't have any recipients yet.{' '}
                  <Link to='/recipients' className='text-primary underline'>
                    Create one
                  </Link>{' '}
                  to subscribe to this topic.
                </p>
              ) : availableRecipients.length === 0 ? (
                <p className='text-sm text-muted-foreground'>
                  All your recipients are already subscribed.
                </p>
              ) : (
                <div className='flex items-end gap-2'>
                  <div className='flex-1'>
                    <label className='text-sm font-medium block mb-1'>
                      Subscribe recipient
                    </label>
                    <select
                      className='w-full bg-background border border-border rounded-sm px-3 py-2 text-sm'
                      value={recipientId}
                      onChange={(e) => setRecipientId(e.target.value)}
                    >
                      <option value=''>Select a recipient…</option>
                      {availableRecipients.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.kind}: {r.address}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button
                    onClick={handleSubscribe}
                    disabled={!recipientId || subscribe.isPending}
                  >
                    {subscribe.isPending ? (
                      <Loader2 className='w-4 h-4 animate-spin' />
                    ) : (
                      <UserPlus className='w-4 h-4' />
                    )}
                    Subscribe
                  </Button>
                </div>
              )}
            </div>
          </ProtectedComponent>
        </CardContent>
      </Card>

      <ProtectedComponent requireScope='was:topic:Grant'>
        <Card>
          <CardHeader>
            <CardIcon>
              <Shield className='w-5 h-5' />
            </CardIcon>
            <CardTitle>Permissions ({permissions.length})</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            {permissions.length === 0 ? (
              <p className='text-sm text-muted-foreground'>
                No permissions granted.
              </p>
            ) : (
              <div className='space-y-2'>
                {permissions.map((p) => (
                  <div
                    key={`${p.user_id}-${p.permission}`}
                    className='flex items-center gap-2 p-2 bg-muted/30 rounded-sm border border-border'
                  >
                    <span className='font-mono text-xs truncate flex-1'>
                      {p.user_id}
                    </span>
                    <Badge variant='outline'>{p.permission}</Badge>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-destructive'
                      onClick={() =>
                        deletePerm.mutate({
                          userId: p.user_id,
                          permission: p.permission,
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
                  value={permUserId}
                  onChange={(e) => setPermUserId(e.target.value)}
                  placeholder='user uuid'
                />
              </div>
              <div>
                <label className='text-sm font-medium block mb-1'>
                  Permission
                </label>
                <select
                  className='bg-background border border-border rounded-sm px-3 py-2 text-sm'
                  value={permName}
                  onChange={(e) => setPermName(e.target.value)}
                >
                  {['Send', 'Get', 'Edit', 'Delete'].map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                onClick={handleAddPermission}
                disabled={!permUserId.trim() || createPerm.isPending}
              >
                {createPerm.isPending ? (
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
