import { FileText } from 'lucide-react';
import { ICON_OPTIONS } from './mappings';

export function NoteIcon({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const Icon = ICON_OPTIONS.find((o) => o.value === value)?.icon ?? FileText;
  return <Icon className={className} />;
}
