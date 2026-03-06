import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import type { UpdateUserRequest } from '@services/users.service';
import { useUpdateSudo } from '@hooks/users/use-update-sudo';
import { useUpdateUser } from '@hooks/users/use-update-user';
import { useGetUser } from '@hooks/users/use-get-user';
import { useDeleteUser } from '@hooks/users/use-delete-user';
import { useUpdatePermissions } from '@hooks/users/use-update-permissions';
import { useForceSetPassword } from '@hooks/auth/use-force-set-password';
import ProtectedComponent from '@components/ProtectedComponent';
import { ConfirmationDialog } from '@components/ConfirmationDialog';
import {
  ArrowLeft,
  User,
  ShieldCheck,
  Save,
  Mail,
  ImageIcon,
  UserCircle,
  Check,
  X,
  AlertTriangle,
  LockKeyholeOpen,
  Shield,
  KeyRound,
  CheckCircle,
  Trash2,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardIcon,
  CardTitle,
  CardDescription,
  CardContent,
} from '@components/base/card';
import { Button, ButtonLink } from '@components/base/button';
import { Badge } from '@components/base/badge';
import { TextField } from '@components/base/text-field';
import { PasswordField } from '@components/base/password-field';
import { LoadingState } from '@components/LoadingState';
import { ErrorState } from '@components/ErrorState';
import { validatePassword } from '@pages/auth/validatePassword';

export default function SingleUserPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: user, isLoading, error } = useGetUser(id);
  const updateUser = useUpdateUser(id);
  const updatePerms = useUpdatePermissions(id);
  const updateSudo = useUpdateSudo(id);
  const deleteUser = useDeleteUser();
  const forceSetPassword = useForceSetPassword(id);
  const form = useForm<UpdateUserRequest>({ values: user ?? {} });

  const [pendingScopes, setPendingScopes] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSet, setPasswordSet] = useState(false);

  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const passwordMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

  if (isLoading) return <LoadingState message='Loading user data...' />;
  if (error || !user) {
    return (
      <ErrorState
        title='Error loading user data'
        message={error?.message || 'Unable to fetch user information'}
      />
    );
  }

  const currentScopes = user.scope ?? [];
  const displayScopes = hasChanges ? pendingScopes : currentScopes;

  const toggleScope = (scope: string) => {
    if (!hasChanges) {
      setPendingScopes(currentScopes);
      setHasChanges(true);
    }
    setPendingScopes((prev) => {
      const scopes = hasChanges ? prev : currentScopes;
      return scopes.includes(scope)
        ? scopes.filter((s) => s !== scope)
        : [...scopes, scope];
    });
  };

  const savePermissions = () => {
    updatePerms.mutate(
      { scope: pendingScopes },
      {
        onSuccess: () => {
          setHasChanges(false);
          setPendingScopes([]);
        },
      },
    );
  };

  const cancelPermissions = () => {
    setPendingScopes([]);
    setHasChanges(false);
  };

  const handleForceSetPassword = (e: React.SubmitEvent) => {
    e.preventDefault();

    if (passwordMismatch || passwordError) return;

    forceSetPassword.mutate(
      { new_password: newPassword },
      {
        onSuccess: () => {
          setNewPassword('');
          setConfirmPassword('');
          setPasswordSet(true);
          setTimeout(() => setPasswordSet(false), 3000);
        },
      },
    );
  };

  const handleDelete = () => {
    deleteUser.mutate(id, {
      onSuccess: () => navigate('/users'),
    });
  };

  return (
    <div className='space-y-4 max-w-3xl mx-auto'>
      <ButtonLink to='/users' variant='link' className='p-0' size='sm'>
        <ArrowLeft className='w-4 h-4' />
        Back to users
      </ButtonLink>

      <Card>
        <CardHeader className='gap-3'>
          <CardIcon className='bg-transparent'>
            <div className='w-12 h-12 bg-primary rounded-full flex items-center justify-center overflow-hidden'>
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className='w-full h-full object-cover'
                />
              ) : (
                <User className='w-6 h-6 text-foreground' />
              )}
            </div>
          </CardIcon>
          <div className='flex flex-col items-start gap-1'>
            <CardTitle>{user.username}</CardTitle>
            <CardDescription>User Profile</CardDescription>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardIcon>
            <UserCircle className='w-5 h-5' />
          </CardIcon>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className='space-y-4'
            onSubmit={form.handleSubmit((v) => updateUser.mutate(v))}
          >
            <TextField
              label='Full Name'
              icon={<User className='w-4 h-4' />}
              placeholder='Enter full name'
              {...form.register('fullname')}
            />
            <TextField
              label='Email'
              icon={<Mail className='w-4 h-4' />}
              type='email'
              placeholder='Enter email'
              {...form.register('email')}
              error={form.formState.errors.email?.message}
            />
            <TextField
              label='Avatar URL'
              icon={<ImageIcon className='w-4 h-4' />}
              placeholder='Enter avatar URL'
              description='URL of your profile picture'
              {...form.register('avatar')}
            />
            <ProtectedComponent requireScope='users:Edit'>
              <Button type='submit' className='w-full'>
                <Save className='w-4 h-4' />
                Save Profile
              </Button>
            </ProtectedComponent>
          </form>
        </CardContent>
      </Card>

      <ProtectedComponent requireScope='sudo'>
        <Card>
          <CardHeader>
            <CardIcon>
              <KeyRound className='w-5 h-5' />
            </CardIcon>
            <div className='flex flex-wrap items-center gap-2'>
              <CardTitle>Set Password</CardTitle>
              <CardDescription>
                Force a new password for this user
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForceSetPassword} className='space-y-4'>
              <PasswordField
                label='New Password'
                placeholder='Enter new password'
                autoComplete='new-password'
                value={newPassword}
                onChange={(e) => {
                  const value = e.target.value;
                  setNewPassword(value);
                  setPasswordError(validatePassword(value));
                }}
                error={passwordError ?? undefined}
                required
              />
              <PasswordField
                label='Confirm Password'
                placeholder='Repeat new password'
                autoComplete='new-password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={passwordMismatch ? 'Passwords do not match' : undefined}
                required
              />
              {forceSetPassword.isError && (
                <p className='text-sm text-destructive'>
                  {forceSetPassword.error.message}
                </p>
              )}
              {passwordSet && (
                <div className='flex items-center gap-2 text-sm text-success'>
                  <CheckCircle className='w-4 h-4' />
                  Password updated successfully.
                </div>
              )}
              <Button
                type='submit'
                variant='destructive'
                className='w-full'
                disabled={
                  forceSetPassword.isPending || !newPassword || passwordMismatch
                }
              >
                <KeyRound className='w-4 h-4' />
                {forceSetPassword.isPending
                  ? 'Updating...'
                  : 'Force Set Password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </ProtectedComponent>

      <Card>
        <CardHeader>
          <CardIcon>
            <LockKeyholeOpen className='w-5 h-5' />
          </CardIcon>
          <CardTitle>Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap gap-2'>
            {ALL_SCOPES.map((scope) => {
              const active = displayScopes.includes(scope);
              return (
                <Badge
                  key={scope}
                  render={(props) => (
                    <button
                      {...props}
                      onClick={() => toggleScope(scope)}
                      disabled={updatePerms.isPending}
                    />
                  )}
                  variant={active ? 'default' : 'outline'}
                  className='cursor-pointer hover:opacity-80 disabled:opacity-50'
                >
                  {scope}
                </Badge>
              );
            })}
          </div>

          {hasChanges && (
            <div className='mt-4 p-3 bg-yellow-900/30 border border-yellow-700 rounded-sm text-yellow-400 text-sm flex gap-2'>
              <AlertTriangle className='w-4 h-4 shrink-0' />
              <span>
                You have unsaved changes. Click "Save" to apply or "Cancel" to
                discard.
              </span>
            </div>
          )}

          {hasChanges && (
            <div className='flex gap-2 justify-end mt-4'>
              <Button
                onClick={savePermissions}
                disabled={updatePerms.isPending}
                variant='secondary'
                size='sm'
                className='bg-green-600 hover:bg-green-700'
              >
                <Check className='w-4 h-4' />
                Save
              </Button>
              <Button
                onClick={cancelPermissions}
                disabled={updatePerms.isPending}
                variant='secondary'
                size='sm'
              >
                <X className='w-4 h-4' />
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardIcon>
            <Shield className='w-5 h-5' />
          </CardIcon>
          <CardTitle>Sudo Access</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col items-start gap-3'>
            <Badge variant={user.is_sudo ? 'purple' : 'outline'}>
              <ShieldCheck className='w-3 h-3' />
              {user.is_sudo ? 'Enabled' : 'Disabled'}
            </Badge>
            <ProtectedComponent requireScope='scope:GiveSudo'>
              <Button
                onClick={() => updateSudo.mutate({ is_sudo: !user.is_sudo })}
                variant='secondary'
                size='sm'
              >
                Toggle Sudo
              </Button>
            </ProtectedComponent>
          </div>
        </CardContent>
      </Card>

      <ProtectedComponent requireScope='users:Delete'>
        <Card className='border-destructive/50'>
          <CardHeader>
            <CardIcon className='bg-destructive/10 text-destructive'>
              <Trash2 className='w-5 h-5' />
            </CardIcon>
            <div>
              <CardTitle>Delete User</CardTitle>
              <CardDescription>
                Permanently remove this user. This action cannot be undone.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              variant='destructive'
              onClick={() => setDeleteOpen(true)}
              disabled={deleteUser.isPending}
            >
              <Trash2 className='w-4 h-4' />
              Delete {user.username}
            </Button>
          </CardContent>
        </Card>
      </ProtectedComponent>

      <ConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title='Delete User'
        description={`Are you sure you want to delete "${user.username}"? This action cannot be undone.`}
        icon={<Trash2 className='w-5 h-5 text-destructive' />}
        confirmText='Delete'
        confirmVariant='destructive'
        onConfirm={handleDelete}
        isLoading={deleteUser.isPending}
        loadingText='Deleting...'
      />
    </div>
  );
}

const ALL_SCOPES = [
  'system:*',
  'system:Read',
  'system:Write',
  'users:*',
  'users:List',
  'users:Get',
  'users:Create',
  'users:Edit',
  'users:Delete',
  'scope:*',
  'scope:Modify',
  'scope:GiveSudo',
  'files:*',
  'files:List',
  'files:Get',
  'files:Upload',
  'files:Download',
  'files:Edit',
  'files:Delete',
  'chat-rooms:*',
  'chat-rooms:List',
  'chat-rooms:Get',
  'chat-rooms:Create',
  'chat-rooms:Edit',
  'chat-rooms:Moderate',
  'chat-rooms:Join',
  'chat-rooms:Delete',
  'notes:*',
  'notes:List',
  'notes:Get',
  'notes:Create',
  'notes:Edit',
  'notes:Delete',
  'templates:*',
  'jobs:*',
  'jobs:List',
  'jobs:Get',
  'jobs:Cancel',
  'jobs:Retry',
  'sandbox:*',
  'sandbox:Run',
  'chat-bot:*',
  'img-gen:*',
] as const;

export type ScopeValue = (typeof ALL_SCOPES)[number];
