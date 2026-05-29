import { useParams, useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import {
  ArrowLeft,
  Container,
  Upload,
  Trash2,
  Archive,
  Lock,
  Globe,
  Shield,
  UserPlus,
  Loader2,
  Settings,
  Save,
  Search,
  ChevronLeft,
  ChevronRight,
  Dot,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardIcon,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from '@components/base/card';
import { Button, ButtonLink } from '@components/base/button';
import { Badge } from '@components/base/badge';
import { TextField } from '@components/base/text-field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@components/base/input-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/base/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@components/base/dialog';
import { LoadingState } from '@components/LoadingState';
import { ErrorState } from '@components/ErrorState';
import { ConfirmationDialog } from '@components/ConfirmationDialog';
import ProtectedComponent from '@components/ProtectedComponent';
import { cn } from '@utils/cn';
import formatBytes from '@utils/formatBytes';

import { useGetBucket } from '@hooks/buckets/use-get-bucket';
import { useUpdateBucket } from '@hooks/buckets/use-update-bucket';
import {
  useBucketGrants,
  useCreateBucketGrant,
  useDeleteBucketGrant,
} from '@hooks/buckets/use-bucket-grants';
import { useListFiles } from '@hooks/files/use-list-files';
import { useUploadFile } from '@hooks/files/use-upload-file';
import { useMultipartUpload } from '@hooks/files/use-multipart-upload';
import { useDeleteFile } from '@hooks/files/use-delete-file';
import { FileIcon } from './FileIcon';
import { EventRouteSelector } from '@components/EventRouteSelector';
import type { FileMetadata } from '@models/file-metadata';
import type { BucketVisibility } from '@services/buckets.service';

const BUCKET_PERMS = ['read', 'write', 'admin'];

const MULTIPART_THRESHOLD = 5 * 1024 * 1024;

function UploadDialog({
  open,
  onOpenChange,
  bucketId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  bucketId: string;
}) {
  const uploadFile = useUploadFile();
  const multipart = useMultipartUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploadDir, setUploadDir] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [progress, setProgress] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);

  const useMultipart =
    pendingFile != null && pendingFile.size > MULTIPART_THRESHOLD;

  const effectiveProgress = useMultipart ? multipart.progress : (progress ?? 0);
  const isBusy = useMultipart
    ? multipart.status !== 'idle' &&
      multipart.status !== 'done' &&
      multipart.status !== 'error'
    : progress !== null;

  const reset = () => {
    setPendingFile(null);
    setUploadDir('');
    setVisibility('public');
    setProgress(null);
    multipart.reset();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingFile) return;

    if (useMultipart) {
      try {
        await multipart.upload({
          file: pendingFile,
          bucketId,
          dir: uploadDir || undefined,
          visibility,
        });
        reset();
        onOpenChange(false);
      } catch {
        /* error state stays visible */
      }
      return;
    }

    setProgress(0);

    uploadFile.mutate(
      {
        file: pendingFile,
        bucketId,
        dir: uploadDir || undefined,
        visibility,
        onProgress: setProgress,
      },
      {
        onSuccess: () => {
          reset();
          onOpenChange(false);
        },
        onSettled: () => setProgress(null),
        onError: () => setProgress(null),
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o && !isBusy) {
          reset();
          onOpenChange(false);
        }
      }}
    >
      <DialogContent className='max-w-sm'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Upload className='w-5 h-5' />
            Upload File
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <input
            ref={fileInputRef}
            type='file'
            className='hidden'
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setPendingFile(f);
              e.target.value = '';
            }}
          />

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const f = e.dataTransfer.files?.[0];
              if (f) setPendingFile(f);
            }}
            onClick={() => !pendingFile && fileInputRef.current?.click()}
            className={cn(
              'flex flex-col items-center justify-center gap-2 rounded-sm border-2 border-dashed px-4 py-6 text-sm transition-colors',
              dragging
                ? 'border-primary bg-primary/10'
                : 'border-border text-muted-fg',
              !pendingFile &&
                'cursor-pointer hover:border-primary/50 hover:bg-muted/50',
            )}
          >
            {pendingFile ? (
              <>
                <span className='font-medium text-main-fg truncate max-w-full'>
                  {pendingFile.name}
                </span>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  Change file
                </Button>
              </>
            ) : (
              <>
                <Upload className='w-6 h-6' />
                <span>Drop a file here or click to browse</span>
              </>
            )}
          </div>

          <TextField
            label='Directory (optional)'
            placeholder='e.g. images/avatars'
            value={uploadDir}
            onChange={(e) => setUploadDir(e.target.value)}
          />

          <div className='space-y-1.5'>
            <p className='text-sm font-medium'>Visibility</p>
            <div className='flex gap-2'>
              {(['public', 'private'] as const).map((v) => (
                <button
                  key={v}
                  type='button'
                  onClick={() => setVisibility(v)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 rounded-sm border px-3 py-2 text-sm transition-colors cursor-pointer capitalize',
                    visibility === v
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-fg hover:border-primary/50',
                  )}
                >
                  {v === 'public' ? (
                    <Globe className='w-4 h-4' />
                  ) : (
                    <Lock className='w-4 h-4' />
                  )}
                  {v}
                </button>
              ))}
            </div>
          </div>

          {pendingFile && useMultipart && (
            <p className='text-xs text-muted-fg'>
              Large file — using multipart upload (
              {(pendingFile.size / 1024 / 1024).toFixed(1)} MB).
            </p>
          )}

          {uploadFile.isError && (
            <p className='text-sm text-destructive'>
              {uploadFile.error.message}
            </p>
          )}
          {multipart.error && (
            <p className='text-sm text-destructive'>{multipart.error}</p>
          )}

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => {
                if (useMultipart && isBusy) multipart.cancel();
                else onOpenChange(false);
              }}
              disabled={!useMultipart && isBusy}
            >
              {useMultipart && isBusy ? 'Abort' : 'Cancel'}
            </Button>
            <Button type='submit' disabled={!pendingFile || isBusy}>
              <Upload className='w-4 h-4' />
              {isBusy
                ? useMultipart
                  ? `${multipart.status} ${effectiveProgress}%`
                  : `${progress}%`
                : 'Upload'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FileRow({
  file,
  bucketId,
  onDelete,
}: {
  file: FileMetadata;
  bucketId: string;
  onDelete: (f: FileMetadata) => void;
}) {
  const navigate = useNavigate();
  return (
    <Card
      className='hover:shadow-xl transition-shadow cursor-pointer'
      onClick={() => navigate(`/media/${bucketId}/files/${file.id}`)}
    >
      <CardHeader className='flex-wrap min-w-0'>
        <CardIcon className='shrink-0'>
          <FileIcon mime={file.mime} />
        </CardIcon>
        <div className='flex-1 min-w-0 basis-0'>
          <CardTitle className='truncate'>{file.basename}</CardTitle>
          <CardDescription className='truncate'>
            {file.filepath}
          </CardDescription>
        </div>
        <div
          className='flex items-center gap-2 shrink-0 basis-full sm:basis-auto sm:ml-auto justify-end'
          onClick={(e) => e.stopPropagation()}
        >
          <Badge variant={file.visibility === 'public' ? 'success' : 'warning'}>
            {file.visibility}
          </Badge>
          <span className='text-xs text-muted-fg whitespace-nowrap'>
            {formatBytes(file.size)}
          </span>
          <Button
            variant='ghost'
            size='icon'
            className='text-destructive'
            onClick={() => onDelete(file)}
          >
            <Trash2 className='w-4 h-4' />
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}

function GrantsSection({ bucketId }: { bucketId: string }) {
  const { data: grantsPage } = useBucketGrants(bucketId);
  const grants = grantsPage?.results;
  const createGrant = useCreateBucketGrant(bucketId);
  const deleteGrant = useDeleteBucketGrant(bucketId);
  const [grantUserId, setGrantUserId] = useState('');
  const [grantPerm, setGrantPerm] = useState(BUCKET_PERMS[0]);

  const handleAdd = () => {
    if (!grantUserId.trim()) return;
    createGrant.mutate(
      { user_id: grantUserId, permission: grantPerm },
      { onSuccess: () => setGrantUserId('') },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardIcon>
          <Shield className='w-5 h-5' />
        </CardIcon>
        <CardTitle>Grants ({grants?.length ?? 0})</CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        {!grants?.length ? (
          <p className='text-sm text-muted-fg'>No grants yet.</p>
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
            <label className='text-sm font-medium block mb-1'>Permission</label>
            <Select
              value={grantPerm}
              onValueChange={(v) => v && setGrantPerm(v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BUCKET_PERMS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleAdd}
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
  );
}

function SettingsSection({
  bucketId,
  onSaved,
}: {
  bucketId: string;
  onSaved: () => void;
}) {
  const { data: bucket } = useGetBucket(bucketId);
  const update = useUpdateBucket(bucketId);
  const [name, setName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [defaultVisibility, setDefaultVisibility] =
    useState<BucketVisibility | null>(null);
  const [archiveAfter, setArchiveAfter] = useState<string | null>(null);
  const [deleteAfter, setDeleteAfter] = useState<string | null>(null);
  const [eventTopics, setEventTopics] = useState<string[] | null>(null);
  const [eventQueues, setEventQueues] = useState<string[] | null>(null);

  if (!bucket) return null;

  const parseDays = (v: string | null, fallback: number | null) => {
    if (v === null) return fallback;
    if (v === '') return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };

  const handleSave = () => {
    update.mutate(
      {
        name: name ?? bucket.name,
        description: description ?? bucket.description,
        default_visibility: defaultVisibility ?? bucket.default_visibility,
        archive_after_days: parseDays(archiveAfter, bucket.archive_after_days),
        delete_after_days: parseDays(deleteAfter, bucket.delete_after_days),
        event_topics: eventTopics ?? bucket.event_topics,
        event_queues: eventQueues ?? bucket.event_queues,
      },
      { onSuccess: () => onSaved() },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardIcon>
          <Settings className='w-5 h-5' />
        </CardIcon>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <TextField
          label='Name'
          defaultValue={bucket.name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label='Description'
          defaultValue={bucket.description ?? ''}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div>
          <label className='text-sm font-medium block mb-1'>
            Default visibility
          </label>
          <Select
            defaultValue={String(bucket.default_visibility)}
            onValueChange={(v) =>
              v && setDefaultVisibility(Number(v) as BucketVisibility)
            }
          >
            <SelectTrigger className='w-full'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='0'>0 — private</SelectItem>
              <SelectItem value='1'>1 — public</SelectItem>
              <SelectItem value='2'>2 — unlisted</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <TextField
          label='Archive after days (empty = never)'
          type='number'
          defaultValue={bucket.archive_after_days ?? ''}
          onChange={(e) => setArchiveAfter(e.target.value)}
        />
        <TextField
          label='Delete after days (empty = never)'
          type='number'
          defaultValue={bucket.delete_after_days ?? ''}
          onChange={(e) => setDeleteAfter(e.target.value)}
        />
        <EventRouteSelector
          topics={eventTopics ?? bucket.event_topics}
          queues={eventQueues ?? bucket.event_queues}
          onTopicsChange={setEventTopics}
          onQueuesChange={setEventQueues}
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

const PAGE_SIZE = 25;

export default function BucketContentsPage() {
  const { bucketId = '' } = useParams();
  const { data: bucket, isLoading, error } = useGetBucket(bucketId);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data: files } = useListFiles(bucketId, {
    search: search.trim() || undefined,
    page,
    page_size: PAGE_SIZE,
  });
  const deleteFile = useDeleteFile();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<FileMetadata | null>(null);

  if (isLoading) return <LoadingState message='Loading bucket…' />;
  if (error || !bucket) {
    return (
      <ErrorState
        title='Bucket not found'
        message={error?.message || 'Unable to load this bucket'}
      />
    );
  }

  const fileList = files?.results ?? [];

  return (
    <div className='space-y-4 max-w-5xl mx-auto'>
      <ButtonLink to='/media' variant='link' className='p-0' size='sm'>
        <ArrowLeft className='w-4 h-4' />
        Back to media
      </ButtonLink>

      <Card>
        <CardHeader className='gap-3 flex-wrap'>
          <CardIcon>
            <Container className='w-5 h-5' />
          </CardIcon>
          <div className='flex flex-col items-start gap-1 flex-1 min-w-0'>
            <CardTitle className='truncate max-w-full'>{bucket.name}</CardTitle>
            {bucket.description && (
              <CardDescription className='truncate max-w-full'>
                {bucket.description}
              </CardDescription>
            )}
            <span className='text-xs text-muted-fg font-mono truncate max-w-full'>
              {bucket.id}
            </span>
          </div>
          <div className='flex gap-2 shrink-0 w-full sm:w-auto sm:ml-auto justify-end'>
            <ProtectedComponent requireScope='wss:file:Upload'>
              <Button size='sm' onClick={() => setUploadOpen(true)}>
                <Upload className='w-4 h-4' />
                Upload
              </Button>
            </ProtectedComponent>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setShowSettings((v) => !v)}
            >
              <Settings className='w-4 h-4' />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {showSettings && (
        <>
          <ProtectedComponent requireScope='wss:bucket:Edit'>
            <SettingsSection
              bucketId={bucketId}
              onSaved={() => setShowSettings(false)}
            />
          </ProtectedComponent>
          <ProtectedComponent requireScope='wss:bucket:Grant'>
            <GrantsSection bucketId={bucketId} />
          </ProtectedComponent>
        </>
      )}

      <InputGroup>
        <InputGroupAddon>
          <Search className='w-4 h-4' />
        </InputGroupAddon>
        <InputGroupInput
          placeholder='Search files…'
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </InputGroup>

      {fileList.length === 0 ? (
        <Card>
          <CardContent className='p-12 text-center'>
            <Archive className='w-16 h-16 text-muted-fg mx-auto mb-4' />
            <p className='text-muted-fg'>
              {search ? 'No files match your search.' : 'No files in this bucket.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className='space-y-3'>
          {fileList.map((f) => (
            <FileRow
              key={f.id}
              file={f}
              bucketId={bucketId}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {fileList.length > 0 && (
        <Card>
          <CardContent className='flex items-center justify-between p-2'>
            <div className='text-sm text-muted-fg flex gap-1 items-center'>
              <span>Page {page}</span>
              <Dot />
              <span>{fileList.length} files</span>
            </div>
            <div className='flex gap-2'>
              <Button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                variant='secondary'
                size='sm'
              >
                <ChevronLeft className='w-4 h-4' />
                <span className='hidden sm:inline'>Previous</span>
              </Button>
              <Button
                onClick={() => setPage((p) => p + 1)}
                disabled={fileList.length < PAGE_SIZE}
                variant='secondary'
                size='sm'
              >
                <span className='hidden sm:inline'>Next</span>
                <ChevronRight className='w-4 h-4' />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        bucketId={bucketId}
      />

      <ConfirmationDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title='Delete file'
        description={`Are you sure you want to delete "${deleteTarget?.basename}"?`}
        icon={<Trash2 className='w-5 h-5 text-destructive' />}
        confirmText='Delete'
        confirmVariant='destructive'
        onConfirm={() =>
          deleteTarget &&
          deleteFile.mutate(deleteTarget.id, {
            onSuccess: () => setDeleteTarget(null),
          })
        }
        isLoading={deleteFile.isPending}
        loadingText='Deleting…'
      />
    </div>
  );
}
