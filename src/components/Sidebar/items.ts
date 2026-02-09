import {
  Home,
  Activity,
  StickyNote,
  HardDrive,
  FlaskConical,
  UsersRound,
  ImagePlus,
  ServerCog,
  LucideBookDashed,
  BotMessageSquare,
} from 'lucide-react';

export interface SidebarItem {
  label: string;
  to: string;
  icon: React.FunctionComponent<{ className: string }>;
  scope?: string;
}

export const sidebarItems: SidebarItem[] = [
  { label: 'Root', to: '/root', icon: Home },
  {
    label: 'System Health',
    to: '/system-health',
    icon: Activity,
    scope: 'system:*',
  },
  {
    label: 'Users',
    to: '/users',
    icon: UsersRound,
    scope: 'users:List',
  },
  {
    label: 'Notes',
    to: '/notes',
    icon: StickyNote,
    scope: 'notes:List',
  },
  {
    label: 'Media',
    to: '/media',
    icon: HardDrive,
    scope: 'files:List',
  },
  {
    label: 'Templates',
    to: '/templates',
    icon: LucideBookDashed,
    scope: 'templates:List',
  },
  {
    label: 'Sandbox',
    to: '/sandbox',
    icon: FlaskConical,
    scope: 'sandbox:List',
  },
  {
    label: 'ChatBot',
    to: '/chat-bot',
    icon: BotMessageSquare,
    scope: 'chat-bot:List',
  },
  {
    label: 'Image Generation',
    to: '/image-generation',
    icon: ImagePlus,
    scope: 'img-gen:List',
  },
  {
    label: 'Background Jobs',
    to: '/background-jobs',
    icon: ServerCog,
    scope: 'bg-jobs:List',
  },
];
