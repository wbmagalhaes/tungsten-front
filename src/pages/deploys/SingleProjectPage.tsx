import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Rocket,
  Loader2,
  Trash2,
  Shield,
  UserPlus,
  Pencil,
  Save,
  Globe,
  ExternalLink,
  UploadCloud,
  FolderUp,
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
import { Input } from '@components/base/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/base/select';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@components/base/tabs';
import { LoadingState } from '@components/LoadingState';
import { ErrorState } from '@components/ErrorState';
import { ConfirmationDialog } from '@components/ConfirmationDialog';
import ProtectedComponent from '@components/ProtectedComponent';
import formatBytes from '@utils/formatBytes';
import formatDate from '@utils/formatDate';
import { createTarGz } from '@utils/createTarGz';

import { useGetProject } from '@hooks/deploys/use-get-project';
import { useUpdateProject } from '@hooks/deploys/use-update-project';
import { useDeleteProject } from '@hooks/deploys/use-delete-project';
import { useDeployProject } from '@hooks/deploys/use-deploy-project';
import {
  useProjectGrants,
  useCreateProjectGrant,
  useDeleteProjectGrant,
} from '@hooks/deploys/use-project-grants';
import {
  canonicalUrl,
  slugUrl,
  validateSlug,
  getDeployErrorMessage,
  type DeployProject,
  type GrantPermission,
} from '@services/deploys.service';

const PERMISSIONS: GrantPermission[] = ['view', 'deploy', 'admin'];

function EditSection({
  project,
  onSaved,
}: {
  project: DeployProject;
  onSaved: () => void;
}) {
  const update = useUpdateProject(project.id);
  const [name, setName] = useState(project.name);
  const [slug, setSlug] = useState(project.slug ?? '');
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    const trimmedSlug = slug.trim();
    if (trimmedSlug) {
      const slugError = validateSlug(trimmedSlug);
      if (slugError) {
        setError(slugError);
        return;
      }
    }
    setError(null);
    update.mutate(
      { name: name.trim(), slug: trimmedSlug || null },
      {
        onSuccess: () => {
          toast.success('Project updated');
          onSaved();
        },
        onError: (e) => setError(getDeployErrorMessage(e)),
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardIcon>
          <Pencil className='w-5 h-5' />
        </CardIcon>
        <CardTitle>Edit Project</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <TextField
          label='Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label='Slug'
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder='my-site'
          description='Leave empty to remove the slug alias.'
        />
        {error && <p className='text-sm text-destructive'>{error}</p>}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSave}
          disabled={!name.trim() || update.isPending}
        >
          {update.isPending ? (
            <Loader2 className='w-4 h-4 animate-spin' />
          ) : (
            <Save className='w-4 h-4' />
          )}
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}

const MAX_BUNDLE_BYTES = 100 * 1024 * 1024;

function DeploySection({ project }: { project: DeployProject }) {
  const deploy = useDeployProject(project.id);
  const [archive, setArchive] = useState<File | null>(null);
  const [folderFiles, setFolderFiles] = useState<File[]>([]);
  const [building, setBuilding] = useState(false);
  const [progress, setProgress] = useState(0);
  const archiveRef = useRef<HTMLInputElement>(null);
  const folderRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const input = folderRef.current;
    if (!input) return;
    input.setAttribute('webkitdirectory', '');
    input.setAttribute('directory', '');
  }, []);

  const reset = () => {
    setArchive(null);
    setFolderFiles([]);
    setProgress(0);
    if (archiveRef.current) archiveRef.current.value = '';
    if (folderRef.current) folderRef.current.value = '';
  };

  const runDeploy = (bundle: Blob, filename: string) => {
    setProgress(0);
    deploy.mutate(
      { bundle, filename, onProgress: setProgress },
      {
        onSuccess: () => {
          toast.success('Deployed successfully');
          reset();
        },
        onError: (e) => toast.error(getDeployErrorMessage(e)),
      },
    );
  };

  const handleUpload = () => {
    if (!archive) return;
    runDeploy(archive, archive.name);
  };

  const handleBuild = async () => {
    if (!folderFiles.length) return;
    setBuilding(true);
    try {
      const bundle = await createTarGz(folderFiles);
      if (bundle.size > MAX_BUNDLE_BYTES) {
        toast.error(
          `Bundle is ${formatBytes(bundle.size)}, over the 100 MB limit.`,
        );
        return;
      }
      runDeploy(bundle, 'bundle.tar.gz');
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : 'Failed to build the bundle.',
      );
    } finally {
      setBuilding(false);
    }
  };

  const busy = building || deploy.isPending;
  const folderBytes = folderFiles.reduce((sum, f) => sum + f.size, 0);

  return (
    <Card>
      <CardHeader>
        <CardIcon>
          <UploadCloud className='w-5 h-5' />
        </CardIcon>
        <CardTitle>Publish</CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        <Tabs defaultValue='folder'>
          <TabsList className='w-full sm:w-fit'>
            <TabsTrigger value='folder' className='flex-1 sm:flex-none'>
              <FolderUp className='w-4 h-4' />
              From folder
            </TabsTrigger>
            <TabsTrigger value='archive' className='flex-1 sm:flex-none'>
              <UploadCloud className='w-4 h-4' />
              Upload .tar.gz
            </TabsTrigger>
          </TabsList>

          <TabsContent value='folder' className='space-y-3 pt-3'>
            <p className='text-sm text-muted-fg'>
              Pick your build folder (e.g.{' '}
              <span className='font-mono'>dist</span>). It is packed into a{' '}
              <span className='font-mono'>.tar.gz</span> in your browser with
              files at the root. Max 100 MB.
            </p>
            <Input
              ref={folderRef}
              type='file'
              multiple
              onChange={(e) => setFolderFiles(Array.from(e.target.files ?? []))}
            />
            {folderFiles.length > 0 && (
              <p className='text-xs text-muted-fg font-mono'>
                {folderFiles.length} files · {formatBytes(folderBytes)}
              </p>
            )}
            <Button
              onClick={handleBuild}
              disabled={!folderFiles.length || busy}
            >
              {busy ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                <Rocket className='w-4 h-4' />
              )}
              {building
                ? 'Packing…'
                : deploy.isPending
                  ? `Deploying… ${progress}%`
                  : 'Compress & Deploy'}
            </Button>
          </TabsContent>

          <TabsContent value='archive' className='space-y-3 pt-3'>
            <p className='text-sm text-muted-fg'>
              Upload a ready <span className='font-mono'>.tar.gz</span> (files
              at the root, e.g.{' '}
              <span className='font-mono'>
                tar -czf bundle.tar.gz -C dist .
              </span>
              ). Max 100 MB.
            </p>
            <Input
              ref={archiveRef}
              type='file'
              accept='.tar.gz,.tgz,application/gzip,application/x-gzip'
              onChange={(e) => setArchive(e.target.files?.[0] ?? null)}
            />
            {archive && (
              <p className='text-xs text-muted-fg font-mono'>
                {archive.name} · {formatBytes(archive.size)}
              </p>
            )}
            <Button onClick={handleUpload} disabled={!archive || busy}>
              {deploy.isPending ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                <Rocket className='w-4 h-4' />
              )}
              {deploy.isPending ? `Deploying… ${progress}%` : 'Deploy'}
            </Button>
          </TabsContent>
        </Tabs>

        {deploy.isPending && (
          <div className='h-1.5 bg-muted rounded-full overflow-hidden'>
            <div
              className='h-full bg-primary transition-all'
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function GrantsSection({ project }: { project: DeployProject }) {
  const { data: grantsPage } = useProjectGrants(project.id);
  const createGrant = useCreateProjectGrant(project.id);
  const deleteGrant = useDeleteProjectGrant(project.id);
  const [grantUserId, setGrantUserId] = useState('');
  const [grantPerm, setGrantPerm] = useState<GrantPermission>('view');

  const grants = grantsPage?.results ?? [];

  const handleAddGrant = () => {
    if (!grantUserId.trim()) return;
    createGrant.mutate(
      { user_id: grantUserId.trim(), permission: grantPerm },
      {
        onSuccess: () => {
          toast.success('Grant added');
          setGrantUserId('');
        },
        onError: (e) => toast.error(getDeployErrorMessage(e)),
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardIcon>
          <Shield className='w-5 h-5' />
        </CardIcon>
        <CardTitle>Grants ({grants.length})</CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        {!grants.length ? (
          <p className='text-sm text-muted-fg'>No grants yet.</p>
        ) : (
          <div className='space-y-2'>
            {grants.map((g) => (
              <div
                key={`${g.user_id}-${g.permission}`}
                className='flex items-center gap-2 p-2 bg-muted/30 rounded-sm border border-border'
              >
                <span className='font-mono text-xs truncate flex-1'>
                  {g.user_id}
                </span>
                <Badge variant='outline'>{g.permission}</Badge>
                <Button
                  variant='ghost'
                  size='icon'
                  className='text-destructive'
                  onClick={() =>
                    deleteGrant.mutate({
                      userId: g.user_id,
                      permission: g.permission,
                    })
                  }
                >
                  <Trash2 className='w-4 h-4' />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className='flex flex-wrap items-end gap-2 pt-2 border-t border-border'>
          <div className='flex-1 min-w-40'>
            <TextField
              label='User ID'
              value={grantUserId}
              onChange={(e) => setGrantUserId(e.target.value)}
              placeholder='user uuid'
            />
          </div>
          <div>
            <label className='text-sm font-medium block mb-1'>Permission</label>
            <Select
              value={grantPerm}
              onValueChange={(v) => v && setGrantPerm(v as GrantPermission)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PERMISSIONS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleAddGrant}
            disabled={!grantUserId.trim() || createGrant.isPending}
          >
            {createGrant.isPending ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <UserPlus className='w-4 h-4' />
            )}
            Grant
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SingleProjectPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: project, isLoading, error } = useGetProject(id);
  const deleteProject = useDeleteProject();
  const [showEdit, setShowEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (isLoading) return <LoadingState message='Loading project…' />;
  if (error || !project) {
    return (
      <ErrorState
        title='Project not found'
        message={error?.message || 'Unable to load this project'}
      />
    );
  }

  return (
    <div className='space-y-4 max-w-3xl mx-auto'>
      <ButtonLink to='/deploys' variant='link' className='p-0' size='sm'>
        <ArrowLeft className='w-4 h-4' />
        Back to deploys
      </ButtonLink>

      <Card>
        <CardHeader className='gap-3 flex-wrap'>
          <CardIcon>
            <Rocket className='w-5 h-5' />
          </CardIcon>
          <div className='flex flex-col items-start gap-1 flex-1 min-w-0'>
            <CardTitle className='truncate max-w-full'>
              {project.name}
            </CardTitle>
            <div className='flex gap-2 flex-wrap'>
              <Badge variant='outline'>{project.kind}</Badge>
              <Badge variant='outline'>
                {formatBytes(project.deployed_bytes)}
              </Badge>
              <Badge
                variant={project.last_deployed_at ? 'success' : 'secondary'}
              >
                {project.last_deployed_at
                  ? `deployed ${formatDate(project.last_deployed_at)}`
                  : 'never deployed'}
              </Badge>
            </div>
            <span className='text-xs text-muted-fg font-mono truncate max-w-full'>
              {project.id}
            </span>
            <div className='flex flex-col gap-0.5 mt-1 text-xs'>
              <a
                href={canonicalUrl(project)}
                target='_blank'
                rel='noreferrer'
                className='inline-flex items-center gap-1 text-primary hover:underline w-fit'
              >
                <Globe className='w-3 h-3' />
                static-{project.id}.tungsten.rocks
              </a>
              {project.slug && (
                <a
                  href={slugUrl(project.slug)}
                  target='_blank'
                  rel='noreferrer'
                  className='inline-flex items-center gap-1 text-primary hover:underline w-fit'
                >
                  <ExternalLink className='w-3 h-3' />
                  {project.slug}.tungsten.rocks
                </a>
              )}
            </div>
          </div>
          <div className='flex gap-2'>
            <ProtectedComponent requireScope='wdp:project:Edit'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowEdit((v) => !v)}
              >
                <Pencil className='w-4 h-4' />
                Edit
              </Button>
            </ProtectedComponent>
            <ProtectedComponent requireScope='wdp:project:Delete'>
              <Button
                variant='outline'
                size='sm'
                className='text-destructive'
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 className='w-4 h-4' />
                Delete
              </Button>
            </ProtectedComponent>
          </div>
        </CardHeader>
      </Card>

      {showEdit && (
        <ProtectedComponent requireScope='wdp:project:Edit'>
          <EditSection project={project} onSaved={() => setShowEdit(false)} />
        </ProtectedComponent>
      )}

      <ProtectedComponent requireScope='wdp:project:Deploy'>
        <DeploySection project={project} />
      </ProtectedComponent>

      <ProtectedComponent requireScope='wdp:project:Grant'>
        <GrantsSection project={project} />
      </ProtectedComponent>

      <ConfirmationDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title='Delete Project'
        description='The site, published files and slug alias will be removed.'
        confirmText='Delete'
        confirmVariant='destructive'
        onConfirm={() =>
          deleteProject.mutate(project.id, {
            onSuccess: () => {
              setConfirmDelete(false);
              navigate('/deploys');
            },
          })
        }
        isLoading={deleteProject.isPending}
        loadingText='Deleting...'
      />
    </div>
  );
}
