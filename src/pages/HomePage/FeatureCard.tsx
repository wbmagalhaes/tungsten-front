type AccentColor =
  | 'blue'
  | 'green'
  | 'orange'
  | 'purple'
  | 'yellow'
  | 'violet'
  | 'fuchsia'
  | 'cyan';

export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: AccentColor;
}

export function FeatureCard({
  icon,
  title,
  description,
  color,
}: FeatureCardProps) {
  return (
    <div
      className={`tg-card tg-feature-card tg-accent-${color} relative border border-white/6 rounded-md bg-white/2 overflow-hidden transition-[border-color,box-shadow] duration-200 p-5 flex items-start gap-4 cursor-default`}
    >
      <div
        className={`tg-feature-icon-wrap tg-accent-${color} w-12 h-12 rounded border border-current flex items-center justify-center shrink-0 relative overflow-hidden transition-[box-shadow,border-color] duration-200`}
      >
        {icon}
      </div>
      <div>
        <div className='tg-feature-title font-mono-tech text-sm font-semibold tracking-[0.05em] text-white/85 mb-1 transition-[text-shadow,color] duration-150'>
          {title}
        </div>
        <div className='tg-feature-desc font-mono-tech text-xs text-white/30 leading-relaxed tracking-[0.02em] transition-colors duration-150'>
          {description}
        </div>
      </div>
    </div>
  );
}
