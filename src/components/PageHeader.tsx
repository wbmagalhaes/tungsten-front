import { Card, CardHeader, CardIcon, CardTitle } from '@components/base/card';

interface PageHeaderProps {
  title: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
}

export default function PageHeader({ title, icon, action }: PageHeaderProps) {
  return (
    <Card>
      <CardHeader className='flex-row items-center justify-between flex-wrap gap-2'>
        <div className='flex items-center gap-2 min-w-0'>
          <CardIcon>{icon}</CardIcon>
          <CardTitle className='truncate'>{title}</CardTitle>
        </div>
        {action && (
          <div className='shrink-0 ml-auto flex flex-wrap gap-2 justify-end'>
            {action}
          </div>
        )}
      </CardHeader>
    </Card>
  );
}
