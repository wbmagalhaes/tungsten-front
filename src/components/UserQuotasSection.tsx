import { useState } from 'react';
import { Gauge, Plus, Trash2, Loader2, Save } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardIcon,
  CardTitle,
  CardContent,
} from '@components/base/card';
import { Button } from '@components/base/button';
import { Badge } from '@components/base/badge';
import { TextField } from '@components/base/text-field';
import { Input } from '@components/base/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/base/select';
import {
  useUserQuotas,
  useUpdateUserQuotas,
  useDeleteUserQuota,
} from '@hooks/quotas/use-admin-quotas';
import {
  parseFlatKey,
  type QuotaModule,
  type QuotaKey,
  type FlatQuotaKey,
} from '@services/quotas.service';

const MODULES: QuotaModule[] = ['files', 'buckets', 'jobs', 'queues'];
const KEYS: QuotaKey[] = [
  'max_count',
  'max_storage_bytes',
  'max_executions_per_day',
  'max_exec_ms_per_day',
  'max_messages_per_day',
];

interface Props {
  userId: string;
}

export function UserQuotasSection({ userId }: Props) {
  const { data: quotas, isLoading } = useUserQuotas(userId);
  const update = useUpdateUserQuotas(userId);
  const remove = useDeleteUserQuota(userId);

  const [draft, setDraft] = useState<Partial<Record<FlatQuotaKey, number>>>({});
  const [newModule, setNewModule] = useState<QuotaModule>('files');
  const [newKey, setNewKey] = useState<QuotaKey>('max_count');
  const [newValue, setNewValue] = useState('');

  const handleSave = () => {
    if (Object.keys(draft).length === 0) return;
    update.mutate(draft, { onSuccess: () => setDraft({}) });
  };

  const handleAdd = () => {
    const value = Number(newValue);
    if (!Number.isFinite(value)) return;
    const flat = `${newModule}:${newKey}` as FlatQuotaKey;
    update.mutate({ [flat]: value }, { onSuccess: () => setNewValue('') });
  };

  const stage = (flat: FlatQuotaKey, value: number) => {
    setDraft((prev) => ({ ...prev, [flat]: value }));
  };

  const grouped: Record<
    QuotaModule,
    { key: QuotaKey; flat: FlatQuotaKey }[]
  > = {
    files: [],
    buckets: [],
    jobs: [],
    queues: [],
  };

  if (quotas) {
    for (const flat of Object.keys(quotas.effective) as FlatQuotaKey[]) {
      const parsed = parseFlatKey(flat);
      if (!parsed) continue;
      if (!MODULES.includes(parsed.module)) continue;
      grouped[parsed.module].push({ key: parsed.key, flat });
    }
  }

  const overrideMap = new Set(
    (quotas?.overrides ?? []).map((o) => `${o.module}:${o.key}`),
  );

  return (
    <Card>
      <CardHeader>
        <CardIcon>
          <Gauge className='w-5 h-5' />
        </CardIcon>
        <CardTitle>Quotas</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {isLoading && (
          <p className='text-sm text-muted-foreground'>Loading…</p>
        )}

        {quotas &&
          MODULES.map((mod) => {
            const keys = grouped[mod];
            if (keys.length === 0) return null;

            return (
              <div key={mod} className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <Badge variant='outline' className='capitalize'>
                    {mod}
                  </Badge>
                </div>
                <div className='space-y-2 pl-2 border-l-2 border-border'>
                  {keys.map(({ key, flat }) => {
                    const current = quotas.effective[flat] ?? 0;
                    const pending = draft[flat];
                    const isOverride = overrideMap.has(flat);
                    return (
                      <div
                        key={flat}
                        className='flex items-center gap-2 text-sm'
                      >
                        <span className='font-mono text-xs flex-1 truncate'>
                          {key}
                        </span>
                        <Input
                          type='number'
                          defaultValue={current}
                          className='w-32 h-8 py-1 text-xs font-mono'
                          onChange={(e) => {
                            const v = Number(e.target.value);
                            if (Number.isFinite(v)) stage(flat, v);
                          }}
                        />
                        {pending != null && pending !== current && (
                          <Badge variant='warning' className='text-[10px]'>
                            unsaved
                          </Badge>
                        )}
                        {isOverride && (
                          <Badge variant='secondary' className='text-[10px]'>
                            override
                          </Badge>
                        )}
                        <Button
                          variant='ghost'
                          size='icon'
                          className='text-destructive'
                          onClick={() => remove.mutate({ module: mod, key })}
                          disabled={!isOverride}
                          title={
                            isOverride
                              ? 'Remove override'
                              : 'No override to remove (inherited)'
                          }
                        >
                          <Trash2 className='w-4 h-4' />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

        {Object.keys(draft).length > 0 && (
          <Button onClick={handleSave} disabled={update.isPending} size='sm'>
            {update.isPending ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <Save className='w-4 h-4' />
            )}
            Save changes
          </Button>
        )}

        <div className='pt-4 border-t border-border space-y-2'>
          <p className='text-xs font-medium'>Add quota override</p>
          <div className='flex flex-wrap items-end gap-2'>
            <div>
              <label className='text-xs block mb-1'>Module</label>
              <Select
                value={newModule}
                onValueChange={(v) => setNewModule(v as QuotaModule)}
              >
                <SelectTrigger size='sm'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MODULES.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className='text-xs block mb-1'>Key</label>
              <Select
                value={newKey}
                onValueChange={(v) => setNewKey(v as QuotaKey)}
              >
                <SelectTrigger size='sm' className='font-mono'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {KEYS.map((k) => (
                    <SelectItem key={k} value={k} className='font-mono'>
                      {k}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='flex-1 min-w-32'>
              <TextField
                label='Value'
                type='number'
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
              />
            </div>
            <Button
              onClick={handleAdd}
              disabled={!newValue || update.isPending}
              size='sm'
            >
              <Plus className='w-4 h-4' />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
