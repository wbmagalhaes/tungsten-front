interface Props {
  value: number;
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'default';
}

export default function ProgressBar({ value, color = 'default' }: Props) {
  const colors = {
    default: 'bg-linear-to-r from-blue-600 to-purple-600',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
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
