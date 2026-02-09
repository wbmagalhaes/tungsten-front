import { useState } from 'react';
import {
  Upload,
  Trash2,
  Download,
  ExternalLink,
  File,
  Image,
  Video,
  Music,
  FileText,
  Archive,
} from 'lucide-react';
import useDeleteFile from '@hooks/files/use-delete-file';
import useListFiles from '@hooks/files/use-list-files';
import useUploadFile from '@hooks/files/use-upload-file';
import useDownloadFile from '@hooks/files/use-download-file';
import type { FileMetadata } from '@models/file-metadata';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardIcon,
  CardTitle,
} from '@components/base/card';
import formatBytes from '@utils/formatBytes';
import PageHeader from '@components/PageHeader';
import { Button } from '@components/base/button';
import { Badge } from '@components/base/badge';

export default function MediaPage() {
  const { data, isLoading, error } = useListFiles({});

  const uploadFile = useUploadFile();
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress(0);
    uploadFile.mutate(
      {
        file,
        dir: '',
        visibility: 'public',
        onProgress: (p) => {
          setUploadProgress(p);
        },
      },
      {
        onSuccess: () => setUploadProgress(null),
        onSettled: () => setUploadProgress(null),
        onError: () => setUploadProgress(null),
      },
    );

    e.target.value = '';
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-gray-400'>Loading files...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-red-400'>Error loading files</div>
      </div>
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
        <div className='bg-gray-800 border border-gray-700 rounded-lg p-12 text-center'>
          <Archive className='w-16 h-16 text-gray-600 mx-auto mb-4' />
          <p className='text-gray-400'>No files uploaded yet</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          {data.results.map((file) => (
            <FileCard key={file.id} file={file} />
          ))}
        </div>
      )}
    </div>
  );
}

interface FileCardProps {
  file: FileMetadata;
}

function FileCard({ file }: FileCardProps) {
  const deleteFile = useDeleteFile();
  const downloadFile = useDownloadFile();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const getFileIcon = (mime?: string) => {
    if (!mime) return <File className='w-8 h-8' />;
    if (mime.startsWith('image/')) return <Image className='w-8 h-8' />;
    if (mime.startsWith('video/')) return <Video className='w-8 h-8' />;
    if (mime.startsWith('audio/')) return <Music className='w-8 h-8' />;
    if (mime.includes('text') || mime.includes('json') || mime.includes('xml'))
      return <FileText className='w-8 h-8' />;
    return <File className='w-8 h-8' />;
  };

  const handleDelete = () => {
    if (!confirm('Delete this file?')) return;
    setIsDeleting(true);
    deleteFile.mutate(file.id, {
      onSuccess: () => setIsDeleting(false),
      onError: () => setIsDeleting(false),
    });
  };

  const handleDownload = () => {
    setIsDownloading(true);
    downloadFile.mutate(
      {
        id: file.id,
        onProgress: (p) => setDownloadProgress(p),
      },
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

  return (
    <Card className='hover:shadow-xl transition-shadow'>
      <CardHeader className='pb-4'>
        <CardIcon>{getFileIcon(file.mime)}</CardIcon>
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
          <span className='text-gray-400'>Type:</span>
          <span
            className='text-gray-200 truncate ml-2'
            title={file.mime || 'Unknown'}
          >
            {file.mime || 'Unknown'}
          </span>
        </div>
        <div className='flex justify-between'>
          <span className='text-gray-400'>Size:</span>
          <span className='text-gray-200 text-nowrap'>
            {formatBytes(file.size)}
          </span>
        </div>
        <div className='flex justify-between'>
          <span className='text-gray-400'>Visibility:</span>
          <Badge variant={file.visibility === 'public' ? 'success' : 'warning'}>
            {file.visibility}
          </Badge>
        </div>
        <div className='flex justify-between'>
          <span className='text-gray-400'>Created:</span>
          <span className='text-gray-200 text-nowrap'>
            {new Date(file.created_at).toLocaleString('pt-BR')}
          </span>
        </div>
      </CardContent>

      <CardFooter>
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

        <Button
          onClick={handleDelete}
          disabled={isDeleting}
          variant='destructive'
          size='icon'
          title='Delete file'
        >
          <Trash2 className='w-4 h-4' />
        </Button>
      </CardFooter>
    </Card>
  );
}
