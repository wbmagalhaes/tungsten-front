import { useState } from 'react';
import { BotMessageSquare, MessageSquare, Clock, Send } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardIcon,
  CardTitle,
} from '@components/base/card';
import { Button } from '@components/base/button';
import { TextField } from '@components/base/text-field';

export default function ChatPage() {
  const [newPrompt, setNewPrompt] = useState('');

  // TODO: Implement endpoint GET /api/chatbot/conversations
  const conversations = [
    {
      id: 1,
      title: 'React Best Practices',
      preview: 'What are the best practices for React components?',
      messages: 12,
      lastMessage: '2 hours ago',
    },
    {
      id: 2,
      title: 'Typescript Tips',
      preview: 'How do I properly type a generic function in TypeScript?',
      messages: 8,
      lastMessage: '5 hours ago',
    },
    {
      id: 3,
      title: 'CSS Grid Layout',
      preview: 'Explain CSS Grid vs Flexbox',
      messages: 15,
      lastMessage: '1 day ago',
    },
    {
      id: 4,
      title: 'API Design',
      preview: 'What are RESTful API design principles?',
      messages: 20,
      lastMessage: '2 days ago',
    },
  ];

  const handleStartChat = () => {
    if (!newPrompt.trim()) return;
    // TODO: Implement endpoint POST /api/chatbot/conversations
    console.log('Starting new chat:', newPrompt);
    setNewPrompt('');
  };

  return (
    <div className='space-y-4'>
      <Card className='border-primary/50 bg-linear-to-br from-primary/10 to-transparent'>
        <CardHeader>
          <CardIcon className='text-primary'>
            <BotMessageSquare className='w-5 h-5' />
          </CardIcon>
          <CardTitle className='text-primary'>ChatBot</CardTitle>
        </CardHeader>
        <CardContent className='flex gap-4'>
          <TextField
            placeholder='Ask me anything...'
            value={newPrompt}
            onChange={(e) => setNewPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStartChat()}
            className='flex-1'
          />
          <Button onClick={handleStartChat} disabled={!newPrompt.trim()}>
            <Send className='w-4 h-4' />
            Send
          </Button>
        </CardContent>
      </Card>

      <div>
        <h2 className='text-lg font-semibold text-foreground mb-3 flex items-center gap-2'>
          <MessageSquare className='w-5 h-5' />
          Conversation History
        </h2>

        <div className='grid grid-cols-1 gap-3'>
          {conversations.map((conv) => (
            <Card
              key={conv.id}
              className='cursor-pointer hover:bg-muted/50 transition-all hover:border-primary/30'
            >
              <CardContent className='p-4 flex-1 min-w-0'>
                <div className='flex items-center gap-2 mb-2'>
                  <h3 className='font-semibold text-foreground truncate'>
                    {conv.title}
                  </h3>
                </div>
                <p className='text-sm text-muted-foreground line-clamp-1 mb-2'>
                  {conv.preview}
                </p>
                <div className='flex items-center gap-4 text-xs text-muted-foreground/60'>
                  <span className='flex items-center gap-1'>
                    <MessageSquare className='w-3 h-3' />
                    {conv.messages} messages
                  </span>
                  <span className='flex items-center gap-1'>
                    <Clock className='w-3 h-3' />
                    {conv.lastMessage}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {conversations.length === 0 && (
        <Card>
          <CardContent className='p-12 text-center'>
            <BotMessageSquare className='w-16 h-16 text-muted-foreground mx-auto mb-4' />
            <p className='text-muted-foreground'>
              No conversations yet. Start chatting above!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
