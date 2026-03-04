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
    <div
      className={`tg-card tg-stack-card tg-accent-${color} relative border border-white/6 rounded-md bg-white/2 overflow-hidden transition-[border-color,box-shadow] duration-200 p-5 flex flex-col items-center text-center gap-2 cursor-default`}
    >
      <div className='tg-card-icon transition-transform duration-100'>
        {icon}
      </div>
      <div className='font-mono-tech font-bold text-[15px] tracking-[0.05em] transition-[text-shadow] duration-150'>
        {name}
      </div>
      <div className='tg-card-label font-mono-tech text-[10px] tracking-widest uppercase text-white/30 transition-colors duration-150'>
        {label}
      </div>
    </div>
  );
}
