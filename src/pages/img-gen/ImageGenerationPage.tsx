import { useState } from 'react';
import {
  ImagePlus,
  Sparkles,
  Clock,
  Download,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardIcon,
  CardTitle,
  CardContent,
} from '@components/base/card';
import { Button } from '@components/base/button';
import { Badge } from '@components/base/badge';
import { Textarea } from '@components/base/text-area';

type ImageStatus = 'generating' | 'done' | 'failed';

interface GeneratedImage {
  id: number;
  prompt: string;
  imageUrl?: string;
  status: ImageStatus;
  createdAt: string;
}

export default function ImageGenerationPage() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // TODO: Implement endpoint GET /api/image-generation/history
  const images: GeneratedImage[] = [
    {
      id: 1,
      prompt: 'A cyberpunk city at night with neon lights',
      imageUrl: 'https://picsum.photos/seed/cyber1/400/400',
      status: 'done',
      createdAt: '2 hours ago',
    },
    {
      id: 2,
      prompt: 'Futuristic robot in a neon forest',
      imageUrl: 'https://picsum.photos/seed/cyber2/400/400',
      status: 'done',
      createdAt: '5 hours ago',
    },
    {
      id: 3,
      prompt: 'Abstract geometric patterns with purple and cyan colors',
      status: 'generating',
      createdAt: '1 minute ago',
    },
    {
      id: 4,
      prompt: 'Synthwave sunset over digital mountains',
      imageUrl: 'https://picsum.photos/seed/cyber3/400/400',
      status: 'done',
      createdAt: '1 day ago',
    },
  ];

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    // TODO: Implement endpoint POST /api/image-generation/generate
    console.log('Generating image:', prompt);
    setTimeout(() => {
      setIsGenerating(false);
      setPrompt('');
    }, 2000);
  };

  return (
    <div className='space-y-4'>
      <Card className='container-neon'>
        <CardHeader>
          <CardIcon className='text-neon'>
            <Sparkles className='w-5 h-5' />
          </CardIcon>
          <CardTitle className='text-neon'>Generate New Image</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Textarea
            placeholder='Describe the image you want to generate...'
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className='min-h-24'
          />
          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className='w-full'
          >
            {isGenerating ? (
              <>
                <Loader2 className='w-4 h-4 animate-spin' />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className='w-4 h-4' />
                Generate Image
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <div>
        <h2 className='text-lg font-semibold text-foreground mb-3 flex items-center gap-2'>
          <ImagePlus className='w-5 h-5' />
          Generation History
        </h2>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4'>
          {images.map((image) => (
            <ImageCard key={image.id} image={image} />
          ))}
        </div>
      </div>

      {images.length === 0 && (
        <Card>
          <CardContent className='p-12 text-center'>
            <ImagePlus className='w-16 h-16 text-muted-foreground mx-auto mb-4' />
            <p className='text-muted-foreground'>
              No images generated yet. Start creating above!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ImageCard({ image }: { image: GeneratedImage }) {
  const statusConfig = {
    generating: {
      badge: <Badge variant='warning'>Generating</Badge>,
      icon: <Loader2 className='w-4 h-4 animate-spin' />,
    },
    done: {
      badge: <Badge variant='success'>Done</Badge>,
      icon: <CheckCircle className='w-4 h-4' />,
    },
    failed: {
      badge: <Badge variant='destructive'>Failed</Badge>,
      icon: null,
    },
  };

  return (
    <Card className='overflow-hidden hover:border-primary/30 transition-all'>
      <div className='aspect-square bg-muted relative overflow-hidden'>
        {image.status === 'generating' ? (
          <div className='absolute inset-0 flex items-center justify-center bg-linear-to-br from-primary/20 to-accent/20'>
            <div className='text-center'>
              <Loader2 className='w-12 h-12 text-primary animate-spin mx-auto mb-2' />
              <p className='text-sm text-muted-foreground'>Generating...</p>
            </div>
          </div>
        ) : image.imageUrl ? (
          <img
            src={image.imageUrl}
            alt={image.prompt}
            className='w-full h-full object-cover'
          />
        ) : (
          <div className='absolute inset-0 flex items-center justify-center'>
            <ImagePlus className='w-12 h-12 text-muted-foreground' />
          </div>
        )}

        {image.status === 'done' && image.imageUrl && (
          <div className='absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center'>
            <Button size='icon-lg' variant='secondary'>
              <Download className='w-5 h-5' />
            </Button>
          </div>
        )}
      </div>

      <CardContent className='p-4'>
        <div className='flex items-start justify-between gap-2 mb-2'>
          {statusConfig[image.status].badge}
        </div>
        <p className='text-sm text-foreground line-clamp-2 mb-2'>
          {image.prompt}
        </p>
        <div className='flex items-center gap-1 text-xs text-muted-foreground'>
          <Clock className='w-3 h-3' />
          {image.createdAt}
        </div>
      </CardContent>
    </Card>
  );
}
