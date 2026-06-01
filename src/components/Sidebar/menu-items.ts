import {
  Activity,
  StickyNote,
  HardDrive,
  UsersRound,
  ImagePlus,
  ServerCog,
  LucideBookDashed,
  BotMessageSquare,
  MessageCircleMore,
  Terminal,
  Layers,
  Megaphone,
  Mail,
  Gauge,
  Rocket,
} from 'lucide-react';

export interface SidebarItem {
  label: string;
  to: string;
  icon: React.FunctionComponent<{ className: string }>;
  scope?: string;
}

export const sidebarItems: SidebarItem[] = [
  { label: 'Root', to: '/root', icon: Terminal },
  { label: 'Inbox', to: '/inbox', icon: Mail },
  {
    label: 'Notes',
    to: '/notes',
    icon: StickyNote,
    scope: 'wnt:note:List',
  },
  {
    label: 'Templates',
    to: '/templates',
    icon: LucideBookDashed,
  },
  {
    label: 'Chat',
    to: '/chat',
    icon: MessageCircleMore,
    scope: 'wct:room:List',
  },
  {
    label: 'Media',
    to: '/media',
    icon: HardDrive,
    scope: 'wss:bucket:List',
  },
  {
    label: 'Background Jobs',
    to: '/background-jobs',
    icon: ServerCog,
    scope: 'wjb:job:List',
  },
  {
    label: 'Queues',
    to: '/queues',
    icon: Layers,
    scope: 'wqs:queue:List',
  },
  {
    label: 'Deploys',
    to: '/deploys',
    icon: Rocket,
    scope: 'wdp:project:List',
  },
  {
    label: 'Notifications',
    to: '/notifications',
    icon: Megaphone,
    scope: 'was:topic:List',
  },
  {
    label: 'ChatBot',
    to: '/chat-bot',
    icon: BotMessageSquare,
  },
  {
    label: 'Image Generation',
    to: '/image-generation',
    icon: ImagePlus,
  },
  {
    label: 'Quotas',
    to: '/quotas',
    icon: Gauge,
  },
  {
    label: 'System Health',
    to: '/system-health',
    icon: Activity,
    scope: 'w74:system:*',
  },
  {
    label: 'Users',
    to: '/users',
    icon: UsersRound,
    scope: 'iam:user:List',
  },
];
