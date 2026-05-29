import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  ArrowLeft,
  Download,
  ExternalLink,
  Trash2,
  Info,
  Pencil,
  FolderInput,
  Archive,
  Eye,
  EyeOff,
  Link as LinkIcon,
  Copy,
  Check,
  Loader2,
  Eye as ViewIcon,
  FileArchive,
  PackageOpen,
} from 'lucide-react';
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
import { TextField } from '@components/base/text-field';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@components/base/dialog';
import { LoadingState } from '@components/LoadingState';
import { ErrorState } from '@components/ErrorState';
import { ConfirmationDialog } from '@components/ConfirmationDialog';
import ProtectedComponent from '@components/ProtectedComponent';

import { useGetFile } from '@hooks/files/use-get-file';
import { useDeleteFile } from '@hooks/files/use-delete-file';
import { useDownloadFile } from '@hooks/files/use-download-file';
import {
  useRenameFile,
  useMoveFile,
  useArchiveFile,
  useSetFileVisibility,
  useSignFile,
  useCompressFile,
  useDecompressFile,
  useViewFile,
} from '@hooks/files/use-file-actions';
import formatBytes from '@utils/formatBytes';
import { FileIcon } from './FileIcon';

export default function SingleFilePage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();

  const { data: file, isLoading, error } = useGetFile(id);
  const deleteFile = useDeleteFile();
  const downloadFile = useDownloadFile();
  const rename = useRenameFile(id);
  const move = useMoveFile(id);
  const archive = useArchiveFile(id);
  const setVisibility = useSetFileVisibility(id);
  const sign = useSignFile(id);
  const compress = useCompressFile(id);
  const decompress = useDecompressFile(id);
  const view = useViewFile();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [moveValue, setMoveValue] = useState('');
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
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
    deleteFile.mutate(file.id, {
      onSuccess: () => navigate(`/media/${file.bucket_id}`),
    });
  };

  const handleRename = () => {
    if (!renameValue.trim()) return;
    rename.mutate(
      { to: renameValue },
      { onSuccess: () => setRenameOpen(false) },
    );
  };

  const handleMove = () => {
    if (!moveValue.trim()) return;
    move.mutate({ to: moveValue }, { onSuccess: () => setMoveOpen(false) });
  };

  const handleToggleVisibility = () => {
    setVisibility.mutate({
      visibility: file.visibility === 'public' ? 'private' : 'public',
    });
  };

  const handleSign = () => {
    sign.mutate(undefined, {
      onSuccess: (data) => setSignedUrl(data.url),
    });
  };

  const handleView = () => {
    view.mutate(id, {
      onSuccess: (blobUrl) => window.open(blobUrl, '_blank', 'noopener'),
    });
  };

  const handleCopySigned = () => {
    if (!signedUrl) return;
    navigator.clipboard.writeText(signedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='space-y-4 max-w-3xl mx-auto'>
      <ButtonLink
        to={`/media/${file.bucket_id}`}
        variant='link'
        className='p-0'
        size='sm'
      >
        <ArrowLeft className='w-4 h-4' />
        Back to bucket
      </ButtonLink>

      <Card>
        <CardHeader className='gap-3'>
          <CardIcon>
            <FileIcon mime={file.mime} />
          </CardIcon>
          <div className='flex flex-col items-start gap-1'>
            <CardTitle>{file.basename}</CardTitle>
            <CardDescription>{file.filepath}</CardDescription>
            {file.is_archived && (
              <Badge variant='warning'>
                <Archive className='w-3 h-3' />
                archived
              </Badge>
            )}
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
            <span className='text-muted-fg'>Type</span>
            <span className='text-main-fg'>{file.mime || 'Unknown'}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-muted-fg'>Size</span>
            <span className='text-main-fg'>{formatBytes(file.size)}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-muted-fg'>Visibility</span>
            <Badge
              variant={file.visibility === 'public' ? 'success' : 'warning'}
              className='py-0'
            >
              {file.visibility}
            </Badge>
          </div>
          <div className='flex justify-between'>
            <span className='text-muted-fg'>Created</span>
            <span className='text-main-fg'>
              {new Date(file.created_at).toLocaleString('pt-BR')}
            </span>
          </div>
          {file.canonical_uri && (
            <div className='flex justify-between items-center'>
              <span className='text-muted-fg'>URL</span>
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
            <Button onClick={handleDownload} disabled={isDownloading}>
              <Download className='w-4 h-4' />
              {isDownloading ? `Downloading ${downloadProgress}%` : 'Download'}
            </Button>
            <Button
              variant='secondary'
              onClick={handleView}
              disabled={view.isPending}
            >
              {view.isPending ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                <ViewIcon className='w-4 h-4' />
              )}
              View
            </Button>
            <ProtectedComponent requireScope='wss:file:Edit'>
              <>
                <Button
                  variant='secondary'
                  onClick={() => {
                    setRenameValue(file.basename);
                    setRenameOpen(true);
                  }}
                >
                  <Pencil className='w-4 h-4' />
                  Rename
                </Button>
                <Button
                  variant='secondary'
                  onClick={() => {
                    setMoveValue(file.filepath);
                    setMoveOpen(true);
                  }}
                >
                  <FolderInput className='w-4 h-4' />
                  Move
                </Button>
                <Button
                  variant='secondary'
                  onClick={handleToggleVisibility}
                  disabled={setVisibility.isPending}
                >
                  {file.visibility === 'public' ? (
                    <EyeOff className='w-4 h-4' />
                  ) : (
                    <Eye className='w-4 h-4' />
                  )}
                  Make {file.visibility === 'public' ? 'private' : 'public'}
                </Button>
              </>
            </ProtectedComponent>
            <ProtectedComponent requireScope='wss:file:Get'>
              <Button
                variant='secondary'
                onClick={handleSign}
                disabled={sign.isPending}
              >
                {sign.isPending ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <LinkIcon className='w-4 h-4' />
                )}
                Signed URL
              </Button>
            </ProtectedComponent>
            <ProtectedComponent requireScope='wss:file:Edit'>
              <>
                <Button
                  variant='outline'
                  onClick={() => compress.mutate()}
                  disabled={compress.isPending}
                >
                  {compress.isPending ? (
                    <Loader2 className='w-4 h-4 animate-spin' />
                  ) : (
                    <FileArchive className='w-4 h-4' />
                  )}
                  Compress
                </Button>
                <Button
                  variant='outline'
                  onClick={() => decompress.mutate()}
                  disabled={decompress.isPending}
                >
                  {decompress.isPending ? (
                    <Loader2 className='w-4 h-4 animate-spin' />
                  ) : (
                    <PackageOpen className='w-4 h-4' />
                  )}
                  Decompress
                </Button>
                <Button
                  variant='outline'
                  onClick={() => setArchiveOpen(true)}
                  disabled={archive.isPending || file.is_archived}
                >
                  <Archive className='w-4 h-4' />
                  Archive
                </Button>
              </>
            </ProtectedComponent>
          </div>
        </CardContent>
      </Card>

      <ProtectedComponent requireScope='wss:file:Delete'>
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
      </ProtectedComponent>{' '}

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

      <ConfirmationDialog
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        title='Archive file'
        description='Archived files are hidden from listings by default but kept in storage.'
        icon={<Archive className='w-5 h-5 text-warning' />}
        confirmText='Archive'
        onConfirm={() =>
          archive.mutate(undefined, {
            onSuccess: () => setArchiveOpen(false),
          })
        }
        isLoading={archive.isPending}
        loadingText='Archiving…'
      />

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename file</DialogTitle>
          </DialogHeader>
          <TextField
            label='New basename'
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            required
            autoFocus
          />
          <DialogFooter>
            <Button variant='outline' onClick={() => setRenameOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleRename}
              disabled={!renameValue.trim() || rename.isPending}
            >
              {rename.isPending ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                <Pencil className='w-4 h-4' />
              )}
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={moveOpen} onOpenChange={setMoveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move file</DialogTitle>
            <DialogDescription>
              Enter the new full filepath.
            </DialogDescription>
          </DialogHeader>
          <TextField
            label='New filepath'
            value={moveValue}
            onChange={(e) => setMoveValue(e.target.value)}
            required
            autoFocus
          />
          <DialogFooter>
            <Button variant='outline' onClick={() => setMoveOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleMove}
              disabled={!moveValue.trim() || move.isPending}
            >
              {move.isPending ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                <FolderInput className='w-4 h-4' />
              )}
              Move
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!signedUrl}
        onOpenChange={(o) => !o && setSignedUrl(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Signed URL</DialogTitle>
            <DialogDescription>
              Anyone with this link can access the file until it expires.
            </DialogDescription>
          </DialogHeader>
          <div className='flex items-center gap-2 bg-muted rounded-sm p-3 font-mono text-xs break-all'>
            <span className='flex-1 select-all'>{signedUrl}</span>
            <Button variant='ghost' size='icon' onClick={handleCopySigned}>
              {copied ? (
                <Check className='w-4 h-4 text-success' />
              ) : (
                <Copy className='w-4 h-4' />
              )}
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={() => setSignedUrl(null)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
