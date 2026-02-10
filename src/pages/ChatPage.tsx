import { useState } from 'react';
import { MessageSquare, Users, Send, Circle, Hash, Clock } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardIcon,
  CardTitle,
  CardContent,
} from '@components/base/card';
import { Button } from '@components/base/button';
import { Badge } from '@components/base/badge';
import { TextField } from '@components/base/text-field';
import { Avatar, AvatarImage, AvatarFallback } from '@components/base/avatar';
import PageHeader from '@components/PageHeader';

interface ChatRoom {
  id: number;
  name: string;
  description: string;
  activeUsers: number;
  lastMessage?: string;
  lastMessageTime?: string;
}

interface ChatMessage {
  id: number;
  userId: number;
  username: string;
  avatar?: string;
  message: string;
  timestamp: string;
  isOwn: boolean;
}

interface ActiveUser {
  id: number;
  username: string;
  avatar?: string;
  status: 'online' | 'away';
}

export default function ChatPage() {
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  // TODO: Implement WebSocket connection to /ws/chat/:roomId
  // TODO: Implement endpoint GET /api/chat/rooms
  const rooms: ChatRoom[] = [
    {
      id: 1,
      name: 'general',
      description: 'General discussion',
      activeUsers: 5,
      lastMessage: 'Hey everyone!',
      lastMessageTime: '2 min ago',
    },
    {
      id: 2,
      name: 'development',
      description: 'Development chat',
      activeUsers: 3,
      lastMessage: 'Fixed the bug',
      lastMessageTime: '10 min ago',
    },
    {
      id: 3,
      name: 'random',
      description: 'Off-topic discussions',
      activeUsers: 8,
      lastMessage: 'Check this out!',
      lastMessageTime: '1 hour ago',
    },
  ];

  // TODO: Implement WebSocket messages stream
  const messages: ChatMessage[] = [
    {
      id: 1,
      userId: 1,
      username: 'alice',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
      message: 'Hey everyone! How are you doing?',
      timestamp: '10:30 AM',
      isOwn: false,
    },
    {
      id: 2,
      userId: 2,
      username: 'bob',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
      message: 'Pretty good! Working on the new feature',
      timestamp: '10:32 AM',
      isOwn: false,
    },
    {
      id: 3,
      userId: 3,
      username: 'you',
      message: 'Nice! Let me know if you need help',
      timestamp: '10:35 AM',
      isOwn: true,
    },
    {
      id: 4,
      userId: 1,
      username: 'alice',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
      message: 'Thanks! Will do 🚀',
      timestamp: '10:36 AM',
      isOwn: false,
    },
  ];

  // TODO: Implement WebSocket active users updates
  const activeUsers: ActiveUser[] = [
    {
      id: 1,
      username: 'alice',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
      status: 'online',
    },
    {
      id: 2,
      username: 'bob',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
      status: 'online',
    },
    {
      id: 3,
      username: 'charlie',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie',
      status: 'away',
    },
    {
      id: 4,
      username: 'dave',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dave',
      status: 'online',
    },
    {
      id: 5,
      username: 'eve',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eve',
      status: 'online',
    },
  ];

  const handleSendMessage = () => {
    if (!message.trim() || !selectedRoom) return;
    // TODO: Send message via WebSocket
    console.log('Sending message:', message, 'to room:', selectedRoom);
    setMessage('');
  };

  if (!selectedRoom) {
    return (
      <div className='space-y-4'>
        <PageHeader title='Chat' icon={<MessageSquare className='w-5 h-5' />} />

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {rooms.map((room) => (
            <Card
              key={room.id}
              className='cursor-pointer hover:border-primary/30 transition-all'
              onClick={() => setSelectedRoom(room.id)}
            >
              <CardHeader>
                <CardIcon>
                  <Hash className='w-5 h-5' />
                </CardIcon>
                <CardTitle>{room.name}</CardTitle>
                <Badge variant='secondary' className='ml-auto'>
                  <Users className='w-3 h-3' />
                  {room.activeUsers}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground mb-3'>
                  {room.description}
                </p>
                {room.lastMessage && (
                  <div className='text-xs text-muted-foreground'>
                    <p className='line-clamp-1 mb-1'>{room.lastMessage}</p>
                    <div className='flex items-center gap-1'>
                      <Clock className='w-3 h-3' />
                      {room.lastMessageTime}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const currentRoom = rooms.find((r) => r.id === selectedRoom);

  return (
    <div className='space-y-4'>
      <PageHeader
        title={`#${currentRoom?.name}`}
        icon={<Hash className='w-5 h-5' />}
        action={
          <Button variant='outline' onClick={() => setSelectedRoom(null)}>
            Back to Rooms
          </Button>
        }
      />

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-12rem)]'>
        <Card className='lg:col-span-3 flex flex-col'>
          <CardContent className='flex-1 overflow-y-auto p-4 space-y-4'>
            {messages.map((msg) => (
              <ChatMessageBubble key={msg.id} message={msg} />
            ))}
          </CardContent>

          <div className='p-4 border-t border-border'>
            <div className='flex gap-2'>
              <TextField
                placeholder='Type a message...'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className='flex-1'
              />
              <Button onClick={handleSendMessage} disabled={!message.trim()}>
                <Send className='w-4 h-4' />
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardIcon>
              <Users className='w-5 h-5' />
            </CardIcon>
            <CardTitle>Active Users</CardTitle>
            <Badge variant='secondary'>{activeUsers.length}</Badge>
          </CardHeader>
          <CardContent className='space-y-2'>
            {activeUsers.map((user) => (
              <div
                key={user.id}
                className='flex items-center gap-3 p-2 rounded-sm hover:bg-muted/30 transition-colors'
              >
                <div className='relative'>
                  <Avatar size='sm'>
                    <AvatarImage src={user.avatar} alt={user.username} />
                    <AvatarFallback>
                      {user.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Circle
                    className={`w-2.5 h-2.5 absolute -bottom-0.5 -right-0.5 ${
                      user.status === 'online'
                        ? 'fill-success text-success'
                        : 'fill-warning text-warning'
                    }`}
                  />
                </div>
                <span className='text-sm text-foreground'>{user.username}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ChatMessageBubble({ message }: { message: ChatMessage }) {
  return (
    <div
      className={`flex gap-3 ${message.isOwn ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {!message.isOwn && (
        <Avatar size='sm'>
          <AvatarImage src={message.avatar} alt={message.username} />
          <AvatarFallback>{message.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
      )}
      <div
        className={`flex-1 max-w-md ${message.isOwn ? 'items-end' : 'items-start'} flex flex-col`}
      >
        {!message.isOwn && (
          <span className='text-xs text-muted-foreground mb-1'>
            {message.username}
          </span>
        )}
        <div
          className={`px-4 py-2 rounded-sm ${
            message.isOwn
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-foreground'
          }`}
        >
          <p className='text-sm whitespace-pre-wrap'>{message.message}</p>
        </div>
        <span className='text-xs text-muted-foreground mt-1'>
          {message.timestamp}
        </span>
      </div>
    </div>
  );
}
