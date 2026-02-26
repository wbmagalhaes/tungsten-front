import {
  FileText,
  Lightbulb,
  CheckCircle,
  Bookmark,
  Star,
  Flame,
  Pin,
  Target,
  Brain,
  ClipboardList,
  type LucideIcon,
} from 'lucide-react';

export const ICON_OPTIONS: { value: string; icon: LucideIcon }[] = [
  { value: 'file-text', icon: FileText },
  { value: 'lightbulb', icon: Lightbulb },
  { value: 'check-circle', icon: CheckCircle },
  { value: 'bookmark', icon: Bookmark },
  { value: 'star', icon: Star },
  { value: 'flame', icon: Flame },
  { value: 'pin', icon: Pin },
  { value: 'target', icon: Target },
  { value: 'brain', icon: Brain },
  { value: 'clipboard-list', icon: ClipboardList },
];

export const COLOR_OPTIONS: {
  value: string;
  label: string;
  classes: string;
}[] = [
  {
    value: 'purple',
    label: 'Purple',
    classes: 'from-purple-500/30 border-purple-500/50',
  },
  {
    value: 'cyan',
    label: 'Cyan',
    classes: 'from-cyan-500/30 border-cyan-500/50',
  },
  {
    value: 'green',
    label: 'Green',
    classes: 'from-green-500/30 border-green-500/50',
  },
  {
    value: 'orange',
    label: 'Orange',
    classes: 'from-orange-500/30 border-orange-500/50',
  },
  {
    value: 'pink',
    label: 'Pink',
    classes: 'from-fuchsia-500/30 border-fuchsia-500/50',
  },
  {
    value: 'rose',
    label: 'Rose',
    classes: 'from-rose-500/30 border-rose-500/50',
  },
  {
    value: 'yellow',
    label: 'Yellow',
    classes: 'from-yellow-500/30 border-yellow-500/50',
  },
  {
    value: 'sky',
    label: 'Sky',
    classes: 'from-sky-500/30 border-sky-500/50',
  },
];

export const COLOR_DOT: Record<string, string> = {
  purple: 'bg-purple-500',
  cyan: 'bg-cyan-500',
  green: 'bg-green-500',
  orange: 'bg-orange-500',
  pink: 'bg-fuchsia-500',
  rose: 'bg-rose-500',
  yellow: 'bg-yellow-500',
  sky: 'bg-sky-500',
};

export function colorClasses(color: string): string {
  return (
    COLOR_OPTIONS.find((c) => c.value === color)?.classes ??
    COLOR_OPTIONS[0].classes
  );
}
