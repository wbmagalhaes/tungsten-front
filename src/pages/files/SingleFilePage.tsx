import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Download, ExternalLink, Trash2, Info } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardIcon,
  CardTitle,
  CardDescription,
  CardContent,
} from '@components/base/card';
import { Button, ButtonLink } from '@components/base/button';
import { Badge } from '@components/base/badge';
import { LoadingState } from '@components/LoadingState';
import { ErrorState } from '@components/ErrorState';
import { ConfirmationDialog } from '@components/ConfirmationDialog';

import { useGetFile } from '@hooks/files/use-get-file';
import { useDeleteFile } from '@hooks/files/use-delete-file';
import { useDownloadFile } from '@hooks/files/use-download-file';
import formatBytes from '@utils/formatBytes';
import { FileIcon } from './FileIcon';

export default function SingleFilePage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();

  const { data: file, isLoading, error } = useGetFile(id);
  const deleteFile = useDeleteFile();
  const downloadFile = useDownloadFile();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  if (isLoading) return <LoadingState message='Loading file…' />;
  if (error || !file) {
    return (
      <ErrorState
        title='Error loading file'
        message={error?.message || 'Unable to fetch file information'}
      />
    );
  }

  const handleDownload = () => {
    setIsDownloading(true);
    downloadFile.mutate(
      { id: file.id, onProgress: (p) => setDownloadProgress(p) },
      {
        onSuccess: () => {
          setIsDownloading(false);
          setDownloadProgress(0);
        },
        onError: () => {
          setIsDownloading(false);
          setDownloadProgress(0);
        },
      },
    );
  };

  const handleDelete = () => {
    deleteFile.mutate(file.id, { onSuccess: () => navigate('/media') });
  };

  return (
    <div className='space-y-4 max-w-3xl mx-auto'>
      <ButtonLink to='/media' variant='link' className='p-0' size='sm'>
        <ArrowLeft className='w-4 h-4' />
        Back to media
      </ButtonLink>

      <Card>
        <CardHeader className='gap-3'>
          <CardIcon>
            <FileIcon mime={file.mime} />
          </CardIcon>
          <div className='flex flex-col items-start gap-1'>
            <CardTitle>{file.basename}</CardTitle>
            <CardDescription>{file.filepath}</CardDescription>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardIcon>
            <Info className='w-5 h-5' />
          </CardIcon>
          <CardTitle>File Details</CardTitle>
        </CardHeader>
        <CardContent className='space-y-3 text-sm'>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Type</span>
            <span className='text-foreground'>{file.mime || 'Unknown'}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Size</span>
            <span className='text-foreground'>{formatBytes(file.size)}</span>
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
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Created</span>
            <span className='text-foreground'>
              {new Date(file.created_at).toLocaleString('pt-BR')}
            </span>
          </div>
          {file.canonical_uri && (
            <div className='flex justify-between items-center'>
              <span className='text-muted-foreground'>URL</span>
              <a
                href={file.canonical_uri}
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary hover:underline flex items-center gap-1 text-xs truncate max-w-xs'
              >
                {file.canonical_uri}
                <ExternalLink className='w-3 h-3 shrink-0' />
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardIcon>
            <Download className='w-5 h-5' />
          </CardIcon>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap gap-2'>
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              className='flex-1'
            >
              <Download className='w-4 h-4' />
              {isDownloading ? `Downloading ${downloadProgress}%` : 'Download'}
            </Button>
            {file.canonical_uri && (
              <Button
                nativeButton={false}
                render={(props) => (
                  <a
                    {...props}
                    href={file.canonical_uri}
                    target='_blank'
                    rel='noopener noreferrer'
                  />
                )}
                variant='secondary'
                size='icon'
                title='Open in new tab'
              >
                <ExternalLink className='w-4 h-4' />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className='border-destructive/50'>
        <CardHeader>
          <CardIcon className='bg-destructive/10 text-destructive'>
            <Trash2 className='w-5 h-5' />
          </CardIcon>
          <div>
            <CardTitle>Delete File</CardTitle>
            <CardDescription>
              Permanently remove this file. This action cannot be undone.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Button
            variant='destructive'
            onClick={() => setDeleteOpen(true)}
            disabled={deleteFile.isPending}
          >
            <Trash2 className='w-4 h-4' />
            Delete File
          </Button>
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title='Delete file'
        description={`Are you sure you want to delete "${file.basename}"? This action cannot be undone.`}
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
