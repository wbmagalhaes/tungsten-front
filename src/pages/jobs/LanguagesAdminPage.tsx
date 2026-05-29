import { useState } from 'react';
import { Code, Plus, Loader2, Check, X } from 'lucide-react';
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
import { Switch } from '@components/base/switch';
import PageHeader from '@components/PageHeader';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@components/base/dialog';
import { LoadingState } from '@components/LoadingState';
import { useJobLanguages } from '@hooks/jobs/use-job-languages';
import { useCreateJobLanguage } from '@hooks/jobs/use-create-language';

export default function LanguagesAdminPage() {
  const { data, isLoading } = useJobLanguages();
  const create = useCreateJobLanguage();
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState('');
  const [defaultTimeoutSeconds, setDefaultTimeoutSeconds] = useState(30);
  const [concurrency, setConcurrency] = useState(4);
  const [maxAttempts, setMaxAttempts] = useState(5);
  const [baseDelaySeconds, setBaseDelaySeconds] = useState(5);
  const [enabled, setEnabled] = useState(true);

  const reset = () => {
    setLanguage('');
    setDefaultTimeoutSeconds(30);
    setConcurrency(4);
    setMaxAttempts(5);
    setBaseDelaySeconds(5);
    setEnabled(true);
  };

  const handleCreate = () => {
    if (!language.trim()) return;
    create.mutate(
      {
        language,
        default_timeout_seconds: defaultTimeoutSeconds,
        concurrency,
        max_attempts: maxAttempts,
        base_delay_seconds: baseDelaySeconds,
        enabled,
      },
      {
        onSuccess: () => {
          reset();
          setOpen(false);
        },
      },
    );
  };

  if (isLoading) return <LoadingState message='Loading languages…' />;

  const languages = data?.results ?? [];

  return (
    <div className='space-y-4'>
      <PageHeader
        title='Job Languages'
        icon={<Code className='w-5 h-5' />}
        action={
          <Button size='icon' onClick={() => setOpen(true)}>
            <Plus className='w-4 h-4' />
          </Button>
        }
      />

      {languages.length === 0 ? (
        <Card>
          <CardContent className='p-12 text-center'>
            <Code className='w-16 h-16 text-muted-fg mx-auto mb-4' />
            <p className='text-muted-fg'>No languages configured.</p>
          </CardContent>
        </Card>
      ) : (
        <div className='space-y-3'>
          {languages.map((l) => (
            <Card key={l.language}>
              <CardHeader>
                <CardIcon>
                  <Code className='w-5 h-5' />
                </CardIcon>
                <div className='flex-1 min-w-0'>
                  <CardTitle className='flex items-center gap-2 flex-wrap'>
                    {l.language}
                    {l.enabled ? (
                      <Badge variant='success'>
                        <Check className='w-3 h-3' />
                        enabled
                      </Badge>
                    ) : (
                      <Badge variant='warning'>
                        <X className='w-3 h-3' />
                        disabled
                      </Badge>
                    )}
                  </CardTitle>
                  <div className='flex gap-2 mt-1 flex-wrap text-xs text-muted-fg'>
                    <Badge variant='outline' className='text-[10px]'>
                      timeout {l.default_timeout_seconds}s
                    </Badge>
                    <Badge variant='outline' className='text-[10px]'>
                      concurrency {l.concurrency}
                    </Badge>
                    <Badge variant='outline' className='text-[10px]'>
                      max-attempts {l.max_attempts}
                    </Badge>
                    <Badge variant='outline' className='text-[10px]'>
                      base-delay {l.base_delay_seconds}s
                    </Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Language</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <TextField
              label='Language'
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder='python'
              required
            />
            <TextField
              label='Default timeout (seconds)'
              type='number'
              value={defaultTimeoutSeconds}
              onChange={(e) =>
                setDefaultTimeoutSeconds(Number(e.target.value) || 0)
              }
            />
            <TextField
              label='Concurrency'
              type='number'
              value={concurrency}
              onChange={(e) => setConcurrency(Number(e.target.value) || 0)}
            />
            <TextField
              label='Max attempts'
              type='number'
              value={maxAttempts}
              onChange={(e) => setMaxAttempts(Number(e.target.value) || 0)}
            />
            <TextField
              label='Base delay (seconds)'
              type='number'
              value={baseDelaySeconds}
              onChange={(e) =>
                setBaseDelaySeconds(Number(e.target.value) || 0)
              }
            />
            <label className='flex items-center gap-2 text-sm'>
              <Switch checked={enabled} onCheckedChange={setEnabled} />
              Enabled
            </label>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!language.trim() || create.isPending}
            >
              {create.isPending ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                <Plus className='w-4 h-4' />
              )}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
