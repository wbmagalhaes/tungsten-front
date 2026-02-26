import { ICON_OPTIONS } from './mappings';

export function IconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className='flex flex-wrap gap-2'>
      {ICON_OPTIONS.map(({ value: v, icon: Icon }) => (
        <button
          key={v}
          type='button'
          onClick={() => onChange(v)}
          className={`w-8 h-8 flex items-center justify-center rounded-sm transition-colors hover:bg-muted cursor-pointer ${
            value === v ? 'bg-primary/20 ring-1 ring-primary' : ''
          }`}
        >
          <Icon className='w-4 h-4' />
        </button>
      ))}
    </div>
  );
}
