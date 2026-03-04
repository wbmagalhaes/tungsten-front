type AccentColor =
  | 'blue'
  | 'green'
  | 'orange'
  | 'purple'
  | 'yellow'
  | 'violet'
  | 'fuchsia'
  | 'cyan';

interface StackCardProps {
  icon: React.ReactNode;
  name: string;
  label: string;
  color: AccentColor;
}

export function StackCard({ icon, name, label, color }: StackCardProps) {
  return (
    <div className={`tg-card tg-stack-card tg-accent-${color}`}>
      <div className='tg-card-icon'>{icon}</div>
      <div className='tg-card-name'>{name}</div>
      <div className='tg-card-label'>{label}</div>
    </div>
  );
}
