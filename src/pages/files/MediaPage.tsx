import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Trash2, Archive, Lock, Globe } from 'lucide-react';
import { useDeleteFile } from '@hooks/files/use-delete-file';
import { useListFiles } from '@hooks/files/use-list-files';
import { useUploadFile } from '@hooks/files/use-upload-file';
import { useListUsers } from '@hooks/users/use-list-users';
import { useAuthStore } from '@stores/useAuthStore';
import type { FileMetadata } from '@models/file-metadata';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardIcon,
  CardTitle,
} from '@components/base/card';
import formatBytes from '@utils/formatBytes';
import PageHeader from '@components/PageHeader';
import { Button, ButtonLink } from '@components/base/button';
import { Badge } from '@components/base/badge';
import { LoadingState } from '@components/LoadingState';
import { ErrorState } from '@components/ErrorState';
import { ConfirmationDialog } from '@components/ConfirmationDialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@components/base/dialog';
import { TextField } from '@components/base/text-field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/base/select';
import { cn } from '@utils/cn';
import { FileIcon } from './FileIcon';

type UploadDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function UploadDialog({ open, onOpenChange }: UploadDialogProps) {
  const uploadFile = useUploadFile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isSudo = useAuthStore((s) => s.isSudo);
  const usersQuery = useListUsers(
    isSudo ? { page_size: 100 } : { page_size: 1 },
  );

  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploadDir, setUploadDir] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [uploadedBy, setUploadedBy] = useState('');
  const [progress, setProgress] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);

  const reset = () => {
    setPendingFile(null);
    setUploadDir('');
    setVisibility('public');
    setUploadedBy('');
    setProgress(null);
  };

  const handleOpenChange = (o: boolean) => {
    if (!o && progress === null) {
      reset();
      onOpenChange(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPendingFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setPendingFile(file);
  };

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!pendingFile) return;
    setProgress(0);
    uploadFile.mutate(
      {
        file: pendingFile,
        dir: uploadDir || undefined,
        visibility,
        uploadedBy: uploadedBy || undefined,
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
            onChange={handleFileInputChange}
          />

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => !pendingFile && fileInputRef.current?.click()}
            className={cn(
              'flex flex-col items-center justify-center gap-2 rounded-sm border-2 border-dashed px-4 py-6 text-sm transition-colors',
              dragging
                ? 'border-primary bg-primary/10'
                : 'border-border text-muted-foreground',
              !pendingFile &&
                'cursor-pointer hover:border-primary/50 hover:bg-muted/50',
            )}
          >
            {pendingFile ? (
              <>
                <span className='font-medium text-foreground truncate max-w-full'>
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
                      : 'border-border text-muted-foreground hover:border-primary/50',
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

          {isSudo && (
            <div className='space-y-1.5'>
              <p className='text-sm font-medium'>Upload as</p>
              <Select
                value={uploadedBy}
                onValueChange={(v) => setUploadedBy(v ?? '')}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue>
                    {(value) => {
                      if (!value) return 'Myself (default)';
                      const u = usersQuery.data?.results.find(
                        (x) => x.id === value,
                      );
                      if (!u) return value;
                      return u.fullname
                        ? `${u.username} — ${u.fullname}`
                        : u.username;
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=''>Myself (default)</SelectItem>
                  {usersQuery.data?.results.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.username}
                      {u.fullname ? ` — ${u.fullname}` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {uploadFile.isError && (
            <p className='text-sm text-destructive'>
              {uploadFile.error.message}
            </p>
          )}

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => handleOpenChange(false)}
              disabled={progress !== null}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={!pendingFile || progress !== null}>
              <Upload className='w-4 h-4' />
              {progress !== null ? `${progress}%` : 'Upload'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface FileCardProps {
  file: FileMetadata;
  onDelete: (file: FileMetadata) => void;
}

function FileCard({ file, onDelete }: FileCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      className='hover:shadow-xl transition-shadow cursor-pointer group'
      onClick={() => navigate(`/media/${file.id}`)}
    >
      <CardHeader className='pb-4'>
        <CardIcon>
          <FileIcon mime={file.mime} />
        </CardIcon>
        <div className='flex-1 min-w-0'>
          <CardTitle className='truncate' title={file.basename}>
            {file.basename}
          </CardTitle>
          <CardDescription className='truncate' title={file.filepath}>
            {file.filepath}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className='space-y-2 text-sm'>
        <div className='flex justify-between'>
          <span className='text-muted-foreground'>Type</span>
          <span
            className='text-foreground truncate ml-2'
            title={file.mime || 'Unknown'}
          >
            {file.mime || 'Unknown'}
          </span>
        </div>
        <div className='flex justify-between'>
          <span className='text-muted-foreground'>Size</span>
          <span className='text-foreground text-nowrap'>
            {formatBytes(file.size)}
          </span>
        </div>
        <div className='flex justify-between'>
          <span className='text-muted-foreground'>Visibility</span>
          <Badge
            variant={file.visibility === 'public' ? 'success' : 'warning'}
            className='py-0'
          >
            {file.visibility}
          </Badge>
        </div>

        <div className='flex gap-2 pt-2' onClick={(e) => e.stopPropagation()}>
          <ButtonLink
            to={`/media/${file.id}`}
            variant='secondary'
            className='flex-1'
            size='sm'
          >
            Open
          </ButtonLink>
          <Button
            variant='destructive'
            size='sm'
            onClick={() => onDelete(file)}
            title='Delete file'
          >
            <Trash2 className='w-4 h-4' />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MediaPage() {
  const { data, isLoading, error } = useListFiles({});
  const deleteFile = useDeleteFile();

  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<FileMetadata | null>(null);

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteFile.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  if (isLoading) return <LoadingState message='Loading files...' />;
  if (error || !data) {
    return (
      <ErrorState
        title='Error loading files'
        message={error?.message || 'Unable to fetch files information'}
      />
    );
  }

  return (
    <div className='space-y-4'>
      <PageHeader
        title='Media Files'
        icon={<Archive className='w-5 h-5' />}
        action={
          <Button size='icon' onClick={() => setShowUploadDialog(true)}>
            <Upload className='w-4 h-4' />
          </Button>
        }
      />

      {data.results.length === 0 ? (
        <div className='bg-background border border-border rounded-sm p-12 text-center'>
          <Archive className='w-16 h-16 text-muted-foreground mx-auto mb-4' />
          <p className='text-muted-foreground'>No files uploaded yet</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          {data.results.map((file) => (
            <FileCard key={file.id} file={file} onDelete={setDeleteTarget} />
          ))}
        </div>
      )}

      <UploadDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
      />

      <ConfirmationDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title='Delete file'
        description={`Are you sure you want to delete "${deleteTarget?.basename}"? This action cannot be undone.`}
        icon={<Trash2 className='w-5 h-5 text-destructive' />}
        confirmText='Delete'
        confirmVariant='destructive'
        onConfirm={handleDelete}
        isLoading={deleteFile.isPending}
        loadingText='Deleting…'
      />
    </div>
  );
}
