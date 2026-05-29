interface Props {
  label: React.ReactNode;
  value: React.ReactNode;
}

export default function InfoItem({ label, value }: Props) {
  return (
    <div className='flex justify-between items-center gap-1'>
      <span className='text-sm text-muted-fg truncate'>{label}</span>
      <span className='text-sm text-main-fg font-medium text-nowrap'>
        {value}
      </span>
    </div>
  );
}
