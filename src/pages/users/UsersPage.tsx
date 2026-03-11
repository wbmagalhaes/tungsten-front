import { useState } from 'react';
import { useListUsers } from '@hooks/users/use-list-users';
import { useCreateUser } from '@hooks/users/user-create-user';
import { useDeleteUser } from '@hooks/users/use-delete-user';
import ProtectedComponent from '@components/ProtectedComponent';
import {
  UserPlus,
  Users,
  ChevronLeft,
  ChevronRight,
  Shield,
  ShieldCheck,
  Dot,
  Trash2,
} from 'lucide-react';
import PageHeader from '@components/PageHeader';
import { Button, ButtonLink } from '@components/base/button';
import { Badge } from '@components/base/badge';
import { Card, CardContent } from '@components/base/card';
import { LoadingState } from '@components/LoadingState';
import { ErrorState } from '@components/ErrorState';
import { ConfirmationDialog } from '@components/ConfirmationDialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@components/base/dialog';
import { TextField } from '@components/base/text-field';
import { PasswordField } from '@components/base/password-field';
import validateUsername from '@pages/auth/validateUsername';
import { validatePassword } from '@pages/auth/validatePassword';
import formatDate from '@utils/formatDate';

type UserTarget = { id: string; username: string };

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useListUsers({ page, page_size: 25 });
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();

  const [createOpen, setCreateOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<UserTarget | null>(null);

  const handleCreateOpen = () => {
    setNewUsername('');
    setNewPassword('');
    setCreateOpen(true);
  };

  const handleCreate = () => {
    if (!newUsername.trim() || !newPassword) return;
    createUser.mutate(
      { username: newUsername.trim().toLowerCase(), password: newPassword },
      { onSuccess: () => setCreateOpen(false) },
    );
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteUser.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  if (isLoading) {
    return <LoadingState message='Loading users...' />;
  }

  if (error || !data) {
    return (
      <ErrorState
        title='Error loading users'
        message={error?.message || 'Unable to fetch users information'}
      />
    );
  }

  return (
    <div className='space-y-4'>
      <PageHeader
        title='Users'
        icon={<Users className='w-5 h-5' />}
        action={
          <ProtectedComponent requireScope='users:Create'>
            <Button onClick={handleCreateOpen} size='icon'>
              <UserPlus className='w-4 h-4' />
            </Button>
          </ProtectedComponent>
        }
      />

      {!data?.results.length ? (
        <Card>
          <CardContent className='p-12 text-center'>
            <Users className='w-16 h-16 text-muted-foreground mx-auto mb-4' />
            <p className='text-muted-foreground'>No users found</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className='hidden md:block overflow-hidden'>
            <table className='w-full text-sm'>
              <thead className='bg-muted border-b border-border'>
                <tr>
                  <th className='p-3 text-left text-foreground font-semibold'>
                    Username
                  </th>
                  <th className='p-3 text-left text-foreground font-semibold'>
                    Full Name
                  </th>
                  <th className='p-3 text-left text-foreground font-semibold'>
                    Email
                  </th>
                  <th className='p-3 text-left text-foreground font-semibold'>
                    Last Login
                  </th>
                  <th className='p-3 text-left text-foreground font-semibold'>
                    Sudo
                  </th>
                  <th className='p-3 text-right text-foreground font-semibold'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.results.map((u) => (
                  <tr
                    key={u.id}
                    className='border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors'
                  >
                    <td className='p-3 text-foreground'>{u.username}</td>
                    <td className='p-3 text-foreground'>{u.fullname || '-'}</td>
                    <td className='p-3 text-foreground'>{u.email || '-'}</td>
                    <td className='p-3 text-foreground'>
                      {formatDate(u.last_login)}
                    </td>
                    <td className='p-3'>
                      {u.is_sudo ? (
                        <Badge variant='purple'>
                          <ShieldCheck className='w-3 h-3' />
                          Yes
                        </Badge>
                      ) : (
                        <Badge variant='outline'>
                          <Shield className='w-3 h-3' />
                          No
                        </Badge>
                      )}
                    </td>
                    <td className='p-3 text-right'>
                      <div className='flex items-center justify-end gap-2'>
                        <ProtectedComponent requireScope='users:Get'>
                          <ButtonLink
                            to={`/users/${u.id}`}
                            variant='secondary'
                            size='sm'
                          >
                            Open
                          </ButtonLink>
                        </ProtectedComponent>
                        <ProtectedComponent requireScope='users:Delete'>
                          <Button
                            variant='destructive'
                            size='sm'
                            onClick={() =>
                              setDeleteTarget({
                                id: u.id,
                                username: u.username,
                              })
                            }
                          >
                            <Trash2 className='w-4 h-4' />
                          </Button>
                        </ProtectedComponent>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <div className='md:hidden space-y-3'>
            {data.results.map((u) => (
              <Card key={u.id}>
                <CardContent>
                  <div className='flex items-start justify-between mb-3'>
                    <div className='flex-1 min-w-0'>
                      <h3 className='font-semibold text-foreground text-lg mb-2'>
                        {u.username}
                      </h3>
                      <div className='space-y-1'>
                        <div>
                          <span className='text-xs text-muted-foreground'>
                            Fullname:
                          </span>
                          <p className='text-sm text-foreground'>
                            {u.fullname || (
                              <span className='text-muted-foreground/60 italic'>
                                not informed
                              </span>
                            )}
                          </p>
                        </div>
                        <div>
                          <span className='text-xs text-muted-foreground'>
                            Email:
                          </span>
                          <p className='text-sm text-foreground'>
                            {u.email || (
                              <span className='text-muted-foreground/60 italic'>
                                not informed
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {u.is_sudo && (
                      <Badge variant='purple' className='ml-2 shrink-0'>
                        <ShieldCheck className='w-3 h-3' />
                        Sudo
                      </Badge>
                    )}
                  </div>

                  <div className='flex gap-2'>
                    <ProtectedComponent requireScope='users:Get'>
                      <ButtonLink
                        to={`/users/${u.id}`}
                        variant='secondary'
                        className='flex-1'
                      >
                        Open Profile
                      </ButtonLink>
                    </ProtectedComponent>
                    <ProtectedComponent requireScope='users:Delete'>
                      <Button
                        variant='destructive'
                        onClick={() =>
                          setDeleteTarget({ id: u.id, username: u.username })
                        }
                      >
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    </ProtectedComponent>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {data && data.results.length > 0 && (
        <Card>
          <CardContent className='flex items-center justify-between p-2'>
            <div className='text-sm text-muted-foreground flex gap-1 items-center'>
              <span>Page {page}</span>
              <Dot />
              <span>{data.results.length} users</span>
            </div>
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
                disabled={!data.results.length || data.results.length < 25}
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

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <UserPlus className='w-5 h-5 text-primary' />
              Create User
            </DialogTitle>
          </DialogHeader>

          <div className='space-y-4'>
            <TextField
              label='Username'
              placeholder='Enter username'
              value={newUsername}
              onChange={(e) => {
                const value = e.target.value;
                setNewUsername(value);
                setUsernameError(validateUsername(value));
              }}
              error={usernameError ?? undefined}
              autoFocus
            />
            <PasswordField
              label='Password'
              placeholder='Enter password'
              autoComplete='new-password'
              value={newPassword}
              onChange={(e) => {
                const value = e.target.value;
                setNewPassword(value);
                setPasswordError(validatePassword(value));
              }}
              error={passwordError ?? undefined}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
            {createUser.isError && (
              <p className='text-sm text-destructive'>
                {createUser.error.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setCreateOpen(false)}
              disabled={createUser.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={
                !newUsername.trim() ||
                !newPassword ||
                !!usernameError ||
                !!passwordError ||
                createUser.isPending
              }
            >
              <UserPlus className='w-4 h-4' />
              {createUser.isPending ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title='Delete User'
        description={`Are you sure you want to delete "${deleteTarget?.username}"? This action cannot be undone.`}
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
