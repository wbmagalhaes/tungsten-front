import { Card, CardHeader, CardIcon, CardTitle } from '@components/base/card';

interface PageHeaderProps {
  title: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
}

export default function PageHeader({ title, icon, action }: PageHeaderProps) {
  return (
    <Card>
      <CardHeader className='flex-row items-center justify-between'>
        <div className='flex items-center gap-2'>
          <CardIcon>{icon}</CardIcon>
          <CardTitle>{title}</CardTitle>
        </div>
        {action && <div className='shrink-0'>{action}</div>}
      </CardHeader>
    </Card>
  );
}
