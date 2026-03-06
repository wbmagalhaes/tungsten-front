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
  title: string;
  description: string;
  color: AccentColor;
}

export function StackCard({ icon, title, description, color }: StackCardProps) {
  return (
    <div
      className={`group tg-card tg-stack-card tg-accent-${color} relative border border-foreground/6 rounded-md bg-foreground/2 transition-[border-color,box-shadow] duration-200 p-5 flex flex-col items-center text-center gap-2 cursor-default`}
    >
      <div className='tg-card-icon transition-transform duration-100'>
        {icon}
      </div>
      <div className='font-cyber font-bold text-sm tracking-[0.05em] transition-[text-shadow] duration-150'>
        {title}
      </div>
      <div className='tg-card-label font-chakra text-sm tracking-widest uppercase text-foreground/40 group-hover:text-foreground/80 transition-colors duration-150'>
        {description}
      </div>
    </div>
  );
}
