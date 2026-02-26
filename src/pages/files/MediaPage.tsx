import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Trash2, Archive } from 'lucide-react';
import { useDeleteFile } from '@hooks/files/use-delete-file';
import { useListFiles } from '@hooks/files/use-list-files';
import { useUploadFile } from '@hooks/files/use-upload-file';
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
import { FileIcon } from './FileIcon';

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
  const uploadFile = useUploadFile();

  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FileMetadata | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadProgress(0);
    uploadFile.mutate(
      {
        file,
        dir: '',
        visibility: 'public',
        onProgress: (p) => setUploadProgress(p),
      },
      {
        onSuccess: () => setUploadProgress(null),
        onSettled: () => setUploadProgress(null),
        onError: () => setUploadProgress(null),
      },
    );
    e.target.value = '';
  };

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
          <>
            <input
              type='file'
              id='file-upload'
              className='hidden'
              onChange={handleUpload}
            />
            <Button
              size='icon'
              render={(props) => <label {...props} htmlFor='file-upload' />}
              disabled={uploadProgress !== null}
              nativeButton={false}
            >
              {uploadProgress === null ? (
                <Upload className='w-4 h-4' />
              ) : (
                <span>{uploadProgress}%</span>
              )}
            </Button>
          </>
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
