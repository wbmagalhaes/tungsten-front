import { Gauge } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardIcon,
  CardTitle,
  CardContent,
} from '@components/base/card';
import PageHeader from '@components/PageHeader';
import { LoadingState } from '@components/LoadingState';
import { ErrorState } from '@components/ErrorState';
import { useMyQuotas } from '@hooks/quotas/use-my-quotas';
import {
  parseFlatKey,
  type QuotaModule,
  type FlatQuotaKey,
} from '@services/quotas.service';

const MODULES: QuotaModule[] = ['files', 'buckets', 'jobs', 'queues'];

function formatValue(key: string, value: number): string {
  if (key.includes('bytes')) {
    if (value > 1024 * 1024 * 1024)
      return `${(value / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    if (value > 1024 * 1024)
      return `${(value / (1024 * 1024)).toFixed(2)} MB`;
    if (value > 1024) return `${(value / 1024).toFixed(2)} KB`;
  }
  if (key.includes('_ms_')) {
    if (value > 60_000)
      return `${(value / 60_000).toFixed(1)} min`;
    if (value > 1000) return `${(value / 1000).toFixed(1)} s`;
    return `${value} ms`;
  }
  return value.toLocaleString();
}

export default function QuotasPage() {
  const { data, isLoading, isError, refetch } = useMyQuotas();

  if (isLoading) return <LoadingState message='Loading quotas…' />;
  if (isError || !data)
    return (
      <ErrorState
        title='Failed to load quotas'
        message='Could not reach the server.'
        onRetry={refetch}
      />
    );

  const grouped: Record<QuotaModule, { key: string; flat: FlatQuotaKey }[]> = {
    files: [],
    buckets: [],
    jobs: [],
    queues: [],
  };

  for (const flat of Object.keys(data.effective) as FlatQuotaKey[]) {
    const parsed = parseFlatKey(flat);
    if (!parsed) continue;
    if (!MODULES.includes(parsed.module)) continue;
    grouped[parsed.module].push({ key: parsed.key, flat });
  }

  return (
    <div className='space-y-4'>
      <PageHeader title='Quotas' icon={<Gauge className='w-5 h-5' />} />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {MODULES.map((mod) => {
          const keys = grouped[mod];
          if (keys.length === 0) return null;

          return (
            <Card key={mod}>
              <CardHeader>
                <CardIcon>
                  <Gauge className='w-5 h-5' />
                </CardIcon>
                <CardTitle className='capitalize'>{mod}</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                {keys.map(({ key, flat }) => {
                  const limit = data.effective[flat] ?? 0;
                  const used = data.usage[flat] ?? 0;
                  const pct = limit ? Math.min(100, (used / limit) * 100) : 0;
                  return (
                    <div key={flat}>
                      <div className='flex justify-between text-sm mb-1'>
                        <span className='text-muted-foreground font-mono text-xs'>
                          {key}
                        </span>
                        <span className='font-mono text-xs'>
                          {formatValue(key, used)} /{' '}
                          {formatValue(key, limit)}
                        </span>
                      </div>
                      <div className='h-1.5 bg-muted rounded-full overflow-hidden'>
                        <div
                          className={
                            pct > 90
                              ? 'h-full bg-destructive'
                              : pct > 75
                                ? 'h-full bg-warning'
                                : 'h-full bg-primary'
                          }
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
