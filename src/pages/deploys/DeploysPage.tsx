import { useState } from 'react';
import {
  Rocket,
  Plus,
  Loader2,
  Trash2,
  ExternalLink,
  Globe,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardIcon,
  CardTitle,
  CardContent,
  CardFooter,
} from '@components/base/card';
import { Button, ButtonLink } from '@components/base/button';
import { Badge } from '@components/base/badge';
import { TextField } from '@components/base/text-field';
import PageHeader from '@components/PageHeader';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@components/base/dialog';
import { LoadingState } from '@components/LoadingState';
import { ErrorState } from '@components/ErrorState';
import { ConfirmationDialog } from '@components/ConfirmationDialog';
import ProtectedComponent from '@components/ProtectedComponent';
import formatBytes from '@utils/formatBytes';
import formatDate from '@utils/formatDate';

import { useListProjects } from '@hooks/deploys/use-list-projects';
import { useCreateProject } from '@hooks/deploys/use-create-project';
import { useDeleteProject } from '@hooks/deploys/use-delete-project';
import { useMyQuotas } from '@hooks/quotas/use-my-quotas';
import {
  canonicalUrl,
  slugUrl,
  validateSlug,
  getDeployErrorMessage,
  type DeployProject,
} from '@services/deploys.service';

function formatLimit(value: number | undefined): string {
  if (value === undefined) return '—';
  if (value === -1) return '∞';
  return value.toLocaleString();
}

function QuotaSummary({ projects }: { projects: DeployProject[] }) {
  const { data } = useMyQuotas();
  if (!data) return null;

  const maxCount = data.effective['deploys:max_count'];
  const maxBytes = data.effective['deploys:max_storage_bytes'];
  const usedCount = data.usage['deploys:max_count'] ?? projects.length;
  const usedBytes =
    data.usage['deploys:max_storage_bytes'] ??
    projects.reduce((sum, p) => sum + p.deployed_bytes, 0);

  return (
    <div className='flex flex-wrap gap-2 text-xs'>
      <Badge variant='outline'>
        {usedCount.toLocaleString()} / {formatLimit(maxCount)} projects
      </Badge>
      <Badge variant='outline'>
        {formatBytes(usedBytes)} /{' '}
        {maxBytes === -1 ? '∞' : formatBytes(maxBytes ?? 0)} storage
      </Badge>
    </div>
  );
}

function CreateDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const create = useCreateProject();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setName('');
    setSlug('');
    setError(null);
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    const trimmedSlug = slug.trim();
    if (trimmedSlug) {
      const slugError = validateSlug(trimmedSlug);
      if (slugError) {
        setError(slugError);
        return;
      }
    }
    setError(null);
    create.mutate(
      { name: name.trim(), slug: trimmedSlug || undefined },
      {
        onSuccess: () => {
          reset();
          onOpenChange(false);
        },
        onError: (e) => setError(getDeployErrorMessage(e)),
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
          <DialogDescription>
            Host a static site on a tungsten.rocks subdomain.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <TextField
            label='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label='Slug (optional)'
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder='my-site'
            description='Friendly subdomain alias. Lowercase letters, digits and hyphens.'
          />
          {error && <p className='text-sm text-destructive'>{error}</p>}
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || create.isPending}
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
  );
}

const PAGE_SIZE = 25;

export default function DeploysPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useListProjects({
    page,
    page_size: PAGE_SIZE,
  });
  const deleteProject = useDeleteProject();
  const [createOpen, setCreateOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  if (isLoading) return <LoadingState message='Loading projects…' />;
  if (isError)
    return (
      <ErrorState
        title='Failed to load projects'
        message='Could not reach the server.'
        onRetry={refetch}
      />
    );

  const projects = data?.results ?? [];

  return (
    <div className='space-y-4'>
      <PageHeader
        title='Deploys'
        icon={<Rocket className='w-5 h-5' />}
        action={
          <ProtectedComponent requireScope='wdp:project:Create'>
            <Button onClick={() => setCreateOpen(true)} size='icon'>
              <Plus className='w-4 h-4' />
            </Button>
          </ProtectedComponent>
        }
      />

      <QuotaSummary projects={projects} />

      {projects.length === 0 && (
        <Card>
          <CardContent className='p-12 text-center'>
            <Rocket className='w-16 h-16 text-muted-fg mx-auto mb-4' />
            <p className='text-muted-fg'>No projects yet.</p>
          </CardContent>
        </Card>
      )}

      <div className='space-y-3'>
        {projects.map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <CardIcon>
                <Rocket className='w-5 h-5' />
              </CardIcon>
              <div className='flex-1 min-w-0'>
                <CardTitle className='truncate'>{p.name}</CardTitle>
                <div className='flex gap-2 mt-1 flex-wrap text-xs'>
                  {p.slug && <Badge variant='outline'>{p.slug}</Badge>}
                  <Badge variant='outline'>
                    {formatBytes(p.deployed_bytes)}
                  </Badge>
                  <Badge variant={p.last_deployed_at ? 'success' : 'secondary'}>
                    {p.last_deployed_at
                      ? `deployed ${formatDate(p.last_deployed_at)}`
                      : 'never deployed'}
                  </Badge>
                </div>
                <div className='flex flex-col gap-0.5 mt-2 text-xs'>
                  <a
                    href={canonicalUrl(p)}
                    target='_blank'
                    rel='noreferrer'
                    className='inline-flex items-center gap-1 text-primary hover:underline w-fit'
                  >
                    <Globe className='w-3 h-3' />
                    static-{p.id}.tungsten.rocks
                  </a>
                  {p.slug && (
                    <a
                      href={slugUrl(p.slug)}
                      target='_blank'
                      rel='noreferrer'
                      className='inline-flex items-center gap-1 text-primary hover:underline w-fit'
                    >
                      <ExternalLink className='w-3 h-3' />
                      {p.slug}.tungsten.rocks
                    </a>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardFooter className='gap-2'>
              <ButtonLink
                to={`/deploys/${p.id}`}
                variant='secondary'
                size='sm'
                className='mr-auto'
              >
                Open
              </ButtonLink>
              <ProtectedComponent requireScope='wdp:project:Delete'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='text-destructive'
                  onClick={() => setConfirmDelete(p.id)}
                >
                  <Trash2 className='w-4 h-4' />
                </Button>
              </ProtectedComponent>
            </CardFooter>
          </Card>
        ))}
      </div>

      {(data?.count ?? 0) > PAGE_SIZE && (
        <Card>
          <CardContent className='flex items-center justify-between p-2'>
            <span className='text-sm text-muted-fg'>
              Page {page} · {data?.count ?? 0} projects
            </span>
            <div className='flex gap-2'>
              <Button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                variant='secondary'
                size='sm'
              >
                <ChevronLeft className='w-4 h-4' />
                <span className='hidden sm:inline'>Previous</span>
              </Button>
              <Button
                onClick={() => setPage((p) => p + 1)}
                disabled={page * PAGE_SIZE >= (data?.count ?? 0)}
                variant='secondary'
                size='sm'
              >
                <span className='hidden sm:inline'>Next</span>
                <ChevronRight className='w-4 h-4' />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <CreateDialog open={createOpen} onOpenChange={setCreateOpen} />

      <ConfirmationDialog
        open={!!confirmDelete}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
        title='Delete Project'
        description='The site, published files and slug alias will be removed.'
        confirmText='Delete'
        confirmVariant='destructive'
        onConfirm={() =>
          confirmDelete &&
          deleteProject.mutate(confirmDelete, {
            onSuccess: () => setConfirmDelete(null),
          })
        }
        isLoading={deleteProject.isPending}
        loadingText='Deleting...'
      />
    </div>
  );
}
