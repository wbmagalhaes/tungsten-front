import {
  Card,
  CardHeader,
  CardIcon,
  CardTitle,
  CardContent,
} from '@components/base/card';

interface Props {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function SystemCard({
  title,
  icon,
  children,
  className,
}: Props) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardIcon>{icon}</CardIcon>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
