import { COLOR_DOT, COLOR_OPTIONS } from './mappings';

export function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className='flex flex-wrap gap-2'>
      {COLOR_OPTIONS.map((c) => (
        <button
          key={c.value}
          type='button'
          title={c.label}
          onClick={() => onChange(c.value)}
          className={`w-7 h-7 rounded-full transition-transform hover:scale-110 cursor-pointer ${
            COLOR_DOT[c.value] ?? 'bg-muted'
          } ${value === c.value ? 'ring-2 ring-offset-2 ring-offset-background ring-primary scale-110' : ''}`}
        />
      ))}
    </div>
  );
}
