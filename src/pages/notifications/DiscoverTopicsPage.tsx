import { Compass, Megaphone } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardIcon,
  CardTitle,
  CardContent,
  CardFooter,
} from '@components/base/card';
import { ButtonLink } from '@components/base/button';
import { Badge } from '@components/base/badge';
import PageHeader from '@components/PageHeader';
import { LoadingState } from '@components/LoadingState';
import { useDiscoverableTopics } from '@hooks/notifications/use-topics';

export default function DiscoverTopicsPage() {
  return (
    <div className='space-y-4'>
      <PageHeader
        title='Discover Topics'
        icon={<Compass className='w-5 h-5' />}
      />
      <DiscoverTopicsSection />
    </div>
  );
}

export function DiscoverTopicsSection() {
  const { data, isLoading } = useDiscoverableTopics();

  if (isLoading) return <LoadingState message='Loading topics…' />;

  const topics = data?.results ?? [];

  return (
    <div className='space-y-4'>
      {topics.length === 0 ? (
        <Card>
          <CardContent className='p-12 text-center'>
            <Compass className='w-16 h-16 text-muted-fg mx-auto mb-4' />
            <p className='text-muted-fg'>No discoverable topics.</p>
          </CardContent>
        </Card>
      ) : (
        <div className='space-y-3'>
          {topics.map((t) => (
            <Card key={t.id}>
              <CardHeader>
                <CardIcon>
                  <Megaphone className='w-5 h-5' />
                </CardIcon>
                <div className='flex-1 min-w-0'>
                  <CardTitle className='flex items-center gap-2 flex-wrap'>
                    {t.name}
                    {t.is_system && <Badge variant='secondary'>system</Badge>}
                  </CardTitle>
                  {t.description && (
                    <p className='text-sm text-muted-fg mt-1'>
                      {t.description}
                    </p>
                  )}
                </div>
              </CardHeader>
              <CardFooter>
                <ButtonLink
                  to={`/topics/${t.id}`}
                  variant='secondary'
                  size='sm'
                  className='ml-auto'
                >
                  Open & subscribe
                </ButtonLink>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
