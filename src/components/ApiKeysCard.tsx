import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardIcon,
  CardTitle,
  CardDescription,
  CardContent,
} from '@components/base/card';
import { Button } from '@components/base/button';
import { Badge } from '@components/base/badge';
import { TextField } from '@components/base/text-field';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@components/base/dialog';
import {
  Key,
  Plus,
  Trash2,
  Copy,
  Check,
  Loader2,
  AlertTriangle,
  Pencil,
} from 'lucide-react';
import { useListApiKeys } from '@hooks/api-keys/use-list-api-keys';
import { useCreateApiKey } from '@hooks/api-keys/use-create-api-key';
import { useDeleteApiKey } from '@hooks/api-keys/use-delete-api-key';
import { useUpdateApiKey } from '@hooks/api-keys/use-update-api-key';
import { useAvailableScopes } from '@hooks/users/use-available-scopes';
import { useAuthStore } from '@stores/useAuthStore';
import type { ApiKey, ApiKeyWithPlaintext } from '@services/api-keys.service';
import ProtectedComponent from '@components/ProtectedComponent';
import formatDate from '@utils/formatDate';

export default function ApiKeysCard() {
  return (
    <ProtectedComponent requireScope='wks:key:List'>
      <ApiKeysCardInner />
    </ProtectedComponent>
  );
}

function ApiKeysCardInner() {
  const { data, isLoading } = useListApiKeys({ page_size: 50 });
  const keys = data?.results;
  const deleteKey = useDeleteApiKey();
  const { data: scopes = [] } = useAvailableScopes();
  const { userScope } = useAuthStore();

  const [showCreate, setShowCreate] = useState(false);
  const [createdKey, setCreatedKey] = useState<ApiKeyWithPlaintext | null>(
    null,
  );
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const availableScopes = scopes.filter((s) =>
    userScope?.some((us) => {
      if (us === s) return true;
      const [uRes, uAct] = us.split(':');
      const [sRes, sAct] = s.split(':');
      return uRes === sRes && (uAct === '*' || uAct === sAct);
    }),
  );

  const handleDelete = () => {
    if (!confirmDeleteId) return;
    deleteKey.mutate(confirmDeleteId, {
      onSuccess: () => setConfirmDeleteId(null),
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardIcon>
            <Key className='w-5 h-5' />
          </CardIcon>
          <div className='flex flex-wrap items-center gap-2 flex-1'>
            <div>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage your personal API keys</CardDescription>
            </div>
            <ProtectedComponent requireScope='wks:key:Create'>
              <Button
                size='sm'
                className='ml-auto'
                onClick={() => setShowCreate(true)}
              >
                <Plus className='w-4 h-4' />
                New Key
              </Button>
            </ProtectedComponent>
          </div>
        </CardHeader>
        <CardContent className='pt-0'>
          {isLoading ? (
            <div className='flex items-center justify-center py-6 text-muted-foreground'>
              <Loader2 className='w-4 h-4 animate-spin mr-2' />
              Loading...
            </div>
          ) : !keys?.length ? (
            <div className='text-sm text-muted-foreground text-center py-6'>
              No API keys yet.
            </div>
          ) : (
            <div className='flex flex-col divide-y divide-border'>
              {keys.map((k) => (
                <div
                  key={k.id}
                  className='flex items-start gap-3 py-3 first:pt-0'
                >
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2 flex-wrap'>
                      <span className='font-medium text-sm truncate'>
                        {k.name}
                      </span>
                      {k.expires_at && (
                        <Badge variant='warning' className='text-xs'>
                          expires {formatDate(k.expires_at)}
                        </Badge>
                      )}
                    </div>
                    <div className='flex flex-wrap gap-1 mt-1.5'>
                      {k.scope.map((s) => (
                        <Badge key={s} variant='outline' className='text-xs'>
                          {s}
                        </Badge>
                      ))}
                    </div>
                    <p className='text-xs text-muted-foreground mt-1'>
                      Created {formatDate(k.created_at)}
                      {k.last_used_at &&
                        ` · Last used ${formatDate(k.last_used_at)}`}
                    </p>
                  </div>
                  <ProtectedComponent requireScope='wks:key:Edit'>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='shrink-0'
                      onClick={() => setEditingKey(k)}
                    >
                      <Pencil className='w-4 h-4' />
                    </Button>
                  </ProtectedComponent>
                  <ProtectedComponent requireScope='wks:key:Delete'>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-destructive hover:text-destructive shrink-0'
                      onClick={() => setConfirmDeleteId(k.id)}
                    >
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </ProtectedComponent>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CreateApiKeyDialog
        open={showCreate}
        onOpenChange={setShowCreate}
        availableScopes={availableScopes}
        onCreated={(key) => {
          setShowCreate(false);
          setCreatedKey(key);
        }}
      />

      {editingKey && (
        <EditApiKeyDialog
          key={editingKey.id}
          apiKey={editingKey}
          availableScopes={availableScopes}
          onClose={() => setEditingKey(null)}
        />
      )}

      <PlaintextKeyDialog
        apiKey={createdKey}
        onClose={() => setCreatedKey(null)}
      />

      <Dialog
        open={!!confirmDeleteId}
        onOpenChange={(o) => !o && setConfirmDeleteId(null)}
      >
        <DialogContent className='max-w-sm'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <AlertTriangle className='w-5 h-5 text-destructive' />
              Revoke API Key
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. The key will stop working
              immediately.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setConfirmDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={handleDelete}
              disabled={deleteKey.isPending}
            >
              {deleteKey.isPending ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                <Trash2 className='w-4 h-4' />
              )}
              Revoke
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

type CreateApiKeyDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableScopes: string[];
  onCreated: (key: ApiKeyWithPlaintext) => void;
};

function CreateApiKeyDialog({
  open,
  onOpenChange,
  availableScopes,
  onCreated,
}: CreateApiKeyDialogProps) {
  const createKey = useCreateApiKey();
  const [name, setName] = useState('');
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
  const [expiresAt, setExpiresAt] = useState('');

  const toggleScope = (scope: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || selectedScopes.length === 0) return;
    createKey.mutate(
      {
        name,
        scope: selectedScopes,
        expires_at: expiresAt || undefined,
      },
      {
        onSuccess: (key) => {
          setName('');
          setSelectedScopes([]);
          setExpiresAt('');
          onCreated(key);
        },
      },
    );
  };

  const handleOpenChange = (o: boolean) => {
    if (!o) {
      setName('');
      setSelectedScopes([]);
      setExpiresAt('');
    }
    onOpenChange(o);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>Create API Key</DialogTitle>
          <DialogDescription>
            The key will only be shown once after creation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <TextField
            label='Name'
            placeholder='My app key'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />

          <TextField
            label='Expires at (optional)'
            type='date'
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
          />

          <div className='space-y-2'>
            <p className='text-sm font-medium'>Scopes</p>
            <div className='flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1'>
              {availableScopes.map((scope) => {
                const active = selectedScopes.includes(scope);
                return (
                  <button
                    key={scope}
                    type='button'
                    onClick={() => toggleScope(scope)}
                    className='cursor-pointer'
                  >
                    <Badge variant={active ? 'default' : 'outline'}>
                      {scope}
                    </Badge>
                  </button>
                );
              })}
            </div>
            {availableScopes.length === 0 && (
              <p className='text-sm text-muted-foreground'>
                No scopes available.
              </p>
            )}
          </div>

          {createKey.isError && (
            <p className='text-sm text-destructive'>
              {createKey.error.message}
            </p>
          )}

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={
                createKey.isPending || !name || selectedScopes.length === 0
              }
            >
              {createKey.isPending ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                <Key className='w-4 h-4' />
              )}
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type EditApiKeyDialogProps = {
  apiKey: ApiKey | null;
  availableScopes: string[];
  onClose: () => void;
};

function EditApiKeyDialog({
  apiKey,
  availableScopes,
  onClose,
}: EditApiKeyDialogProps) {
  const updateKey = useUpdateApiKey(apiKey?.id ?? '');
  const [selectedScopes, setSelectedScopes] = useState<string[]>(
    apiKey?.scope ?? [],
  );

  const allScopes = Array.from(
    new Set([...availableScopes, ...(apiKey?.scope ?? [])]),
  );

  const toggleScope = (scope: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey || selectedScopes.length === 0) return;
    updateKey.mutate({ scope: selectedScopes }, { onSuccess: () => onClose() });
  };

  return (
    <Dialog open={!!apiKey} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>Edit API Key Scopes</DialogTitle>
          <DialogDescription>
            {apiKey?.name} — adjust the scopes attached to this key.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <p className='text-sm font-medium'>Scopes</p>
            <div className='flex flex-wrap gap-2 max-h-64 overflow-y-auto p-1'>
              {allScopes.map((scope) => {
                const active = selectedScopes.includes(scope);
                const unavailable = !availableScopes.includes(scope);
                return (
                  <button
                    key={scope}
                    type='button'
                    onClick={() => toggleScope(scope)}
                    className='cursor-pointer'
                    title={
                      unavailable
                        ? 'You no longer hold this permission'
                        : undefined
                    }
                  >
                    <Badge
                      variant={
                        active
                          ? unavailable
                            ? 'warning'
                            : 'default'
                          : 'outline'
                      }
                    >
                      {scope}
                    </Badge>
                  </button>
                );
              })}
            </div>
            {allScopes.length === 0 && (
              <p className='text-sm text-muted-foreground'>
                No scopes available.
              </p>
            )}
          </div>

          {updateKey.isError && (
            <p className='text-sm text-destructive'>
              {updateKey.error.message}
            </p>
          )}

          <DialogFooter>
            <Button type='button' variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={updateKey.isPending || selectedScopes.length === 0}
            >
              {updateKey.isPending ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                <Pencil className='w-4 h-4' />
              )}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type PlaintextKeyDialogProps = {
  apiKey: ApiKeyWithPlaintext | null;
  onClose: () => void;
};

function PlaintextKeyDialog({ apiKey, onClose }: PlaintextKeyDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey.plaintext);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={!!apiKey} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Check className='w-5 h-5 text-success' />
            API Key Created
          </DialogTitle>
          <DialogDescription>
            Copy your key now. It will not be shown again.
          </DialogDescription>
        </DialogHeader>

        <div className='flex items-center gap-2 bg-muted rounded-sm p-3 font-mono text-sm break-all'>
          <span className='flex-1 select-all'>{apiKey?.plaintext}</span>
          <Button
            variant='ghost'
            size='icon'
            className='shrink-0'
            onClick={handleCopy}
          >
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
