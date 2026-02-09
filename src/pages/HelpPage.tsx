import { Card, CardContent } from '@components/base/card';
import { cn } from '@utils/cn';
import {
  StickyNote,
  BotMessageSquare,
  ImagePlus,
  FlaskConical,
} from 'lucide-react';

export default function HelpPage() {
  const helpTopics = [
    {
      title: 'Notes',
      description: 'Learn how to take notes with markdown support.',
      icon: <StickyNote className='w-6 h-6' />,
      color: 'yellow',
    },
    {
      title: 'ChatBot',
      description: 'Using the language model interface effectively.',
      icon: <BotMessageSquare className='w-6 h-6' />,
      color: 'violet',
    },
    {
      title: 'Image Generation',
      description: 'Generate AI-powered images from prompts.',
      icon: <ImagePlus className='w-6 h-6' />,
      color: 'fuchsia',
    },
    {
      title: 'Sandbox',
      description: 'Testing and experimentation environment.',
      icon: <FlaskConical className='w-6 h-6' />,
      color: 'cyan',
    },
  ];

  const colorClasses: Record<string, string> = {
    yellow: 'bg-yellow-900/30 text-yellow-400 border-yellow-800',
    violet: 'bg-violet-900/30 text-violet-400 border-violet-800',
    fuchsia: 'bg-fuchsia-900/30 text-fuchsia-400 border-fuchsia-800',
    cyan: 'bg-cyan-900/30 text-cyan-400 border-cyan-800',
  };

  return (
    <div className='container mx-auto px-4 pt-8 md:pt-16'>
      <div className='max-w-4xl mx-auto text-center'>
        <h1 className='text-5xl md:text-6xl font-bold text-foreground mb-4'>
          Help Center
        </h1>
        <p className='text-xl text-muted-foreground mb-10 max-w-2xl mx-auto'>
          Find guides and information to help you use Tungsten efficiently.
        </p>

        <div className='grid md:grid-cols-2 gap-6 mb-12'>
          {helpTopics.map((topic) => (
            <Card key={topic.title}>
              <CardContent>
                <div className='flex items-start gap-4'>
                  <div
                    className={cn(
                      'w-12 h-12 rounded-sm flex items-center justify-center shrink-0 border',
                      colorClasses[topic.color],
                    )}
                  >
                    {topic.icon}
                  </div>
                  <div className='text-left'>
                    <h3 className='font-semibold text-foreground mb-1'>
                      {topic.title}
                    </h3>
                    <p className='text-muted-foreground text-sm'>{topic.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
