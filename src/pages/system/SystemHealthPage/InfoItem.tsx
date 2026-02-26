interface Props {
  label: React.ReactNode;
  value: React.ReactNode;
}

export default function InfoItem({ label, value }: Props) {
  return (
    <div className='flex justify-between items-center gap-1'>
      <span className='text-sm text-muted-foreground truncate'>{label}</span>
      <span className='text-sm text-foreground font-medium text-nowrap'>
        {value}
      </span>
    </div>
  );
}
