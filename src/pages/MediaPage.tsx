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
import useDeleteFile from '@hooks/files/useDeleteFile';
import useListFiles from '@hooks/files/useListFiles';
import useUploadFile from '@hooks/files/useUploadFile';
import useDownloadFile from '@hooks/files/useDownloadFile';
import type { FileMetadata } from '@models/file-metadata';

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
      <div className='bg-gray-800 border border-gray-700 p-4 rounded-lg shadow-lg flex items-center justify-between'>
        <h1 className='text-xl font-semibold text-white flex items-center gap-2'>
          <Archive className='w-5 h-5' /> Media Files
        </h1>
        <label className='cursor-pointer px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2'>
          {uploadProgress === null ? (
            <>
              <Upload className='w-4 h-4' />
              Upload
              <input type='file' className='hidden' onChange={handleUpload} />
            </>
          ) : (
            <span className='text-white ml-4'>
              Uploading: {uploadProgress}%
            </span>
          )}
        </label>
      </div>

      {data.results.length === 0 ? (
        <div className='bg-gray-800 border border-gray-700 rounded-lg p-12 text-center'>
          <Archive className='w-16 h-16 text-gray-600 mx-auto mb-4' />
          <p className='text-gray-400'>No files uploaded yet</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
    return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
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
    <div className='bg-gray-800 border border-gray-700 rounded-lg p-5 shadow-lg hover:shadow-xl transition-shadow'>
      <div className='flex items-start gap-3 mb-4'>
        <div className='text-blue-400 shrink-0'>{getFileIcon(file.mime)}</div>
        <div className='flex-1 min-w-0'>
          <h3
            className='font-semibold text-white truncate'
            title={file.basename}
          >
            {file.basename}
          </h3>
          <p className='text-xs text-gray-400 truncate' title={file.filepath}>
            {file.filepath}
          </p>
        </div>
      </div>

      <div className='space-y-2 mb-4 text-sm'>
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
            {formatFileSize(file.size)}
          </span>
        </div>
        <div className='flex justify-between'>
          <span className='text-gray-400'>Visibility:</span>
          <span
            className={`px-2 py-0.5 rounded text-xs font-medium text-nowrap ${
              file.visibility === 'public'
                ? 'bg-green-900/50 text-green-400'
                : 'bg-orange-900/50 text-orange-400'
            }`}
          >
            {file.visibility}
          </span>
        </div>
        <div className='flex justify-between'>
          <span className='text-gray-400'>Created:</span>
          <span className='text-gray-200 text-nowrap'>
            {new Date(file.created_at).toLocaleString('pt-BR')}
          </span>
        </div>
      </div>

      <div className='flex gap-2 pt-3 border-t border-gray-700'>
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className='flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50'
        >
          <Download className='w-4 h-4' />
          {isDownloading ? `Downloading ${downloadProgress}%` : 'Download'}
        </button>

        {file.canonical_uri && (
          <a
            href={file.canonical_uri}
            target='_blank'
            rel='noopener noreferrer'
            className='px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center'
            title='Open in new tab'
          >
            <ExternalLink className='w-4 h-4' />
          </a>
        )}

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className='px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm font-medium transition-colors flex items-center justify-center disabled:opacity-50'
          title='Delete file'
        >
          <Trash2 className='w-4 h-4' />
        </button>
      </div>
    </div>
  );
}
