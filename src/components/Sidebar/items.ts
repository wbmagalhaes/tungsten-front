import {
  Home,
  Activity,
  StickyNote,
  HardDrive,
  FlaskConical,
  ImagePlus,
  ServerCog,
  LucideBookDashed,
  BotMessageSquare,
} from 'lucide-react';

export const sidebarItems = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'System Health', to: '/system-health', icon: Activity },
  { label: 'Notes', to: '/notes', icon: StickyNote },
  { label: 'Media', to: '/media', icon: HardDrive },
  { label: 'Templates', to: '/templates', icon: LucideBookDashed },
  { label: 'Sandbox', to: '/sandbox', icon: FlaskConical },
  { label: 'ChatBot', to: '/chat-bot', icon: BotMessageSquare },
  { label: 'Image Generation', to: '/image-generation', icon: ImagePlus },
  { label: 'Background Jobs', to: '/background-jobs', icon: ServerCog },
];
