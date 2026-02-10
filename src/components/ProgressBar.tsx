interface Props {
  value: number;
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'default';
}

export default function ProgressBar({ value, color = 'default' }: Props) {
  const colors = {
    default: 'bg-main-gradient',
    blue: 'bg-info',
    green: 'bg-success',
    yellow: 'bg-warning',
    purple: 'bg-primary',
  };

  return (
    <div className='w-full bg-secondary rounded-full h-2 overflow-hidden'>
      <div
        className={`h-full ${colors[color]} transition-all duration-300`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}
