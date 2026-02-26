import { File, Image, Video, Music, FileText } from 'lucide-react';

export function FileIcon({ mime }: { mime?: string }) {
  if (!mime) return <File className='w-8 h-8' />;
  if (mime.startsWith('image/')) return <Image className='w-8 h-8' />;
  if (mime.startsWith('video/')) return <Video className='w-8 h-8' />;
  if (mime.startsWith('audio/')) return <Music className='w-8 h-8' />;
  if (mime.includes('text') || mime.includes('json') || mime.includes('xml'))
    return <FileText className='w-8 h-8' />;
  return <File className='w-8 h-8' />;
}
