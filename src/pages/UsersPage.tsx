import { useState } from 'react';
import { useListUsers } from '@hooks/users/use-list-users';
import { useCreateUser } from '@hooks/users/user-create-user';
import ProtectedComponent from '@components/ProtectedComponent';
import {
  UserPlus,
  Users,
  ChevronLeft,
  ChevronRight,
  Shield,
  ShieldCheck,
  Dot,
} from 'lucide-react';
import PageHeader from '@components/PageHeader';
import { Button, ButtonLink } from '@components/base/button';
import { Badge } from '@components/base/badge';
import { Card, CardContent } from '@components/base/card';
import { LoadingState } from '@components/LoadingState';
import { ErrorState } from '@components/ErrorState';

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useListUsers({ page, page_size: 25 });
  const createUser = useCreateUser();

  function handleAddUser() {
    const username = prompt('Username:');
    const password = prompt('Password:');
    if (!username || !password) return;
    createUser.mutate({ username, password });
  }

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
            <Button onClick={handleAddUser}>
              <UserPlus className='w-4 h-4' />
              <span className='hidden sm:inline'>Add User</span>
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
                      <ProtectedComponent requireScope='users:Get'>
                        <ButtonLink
                          to={`/users/${u.id}`}
                          variant='secondary'
                          size='sm'
                        >
                          Open
                        </ButtonLink>
                      </ProtectedComponent>
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

                  <ProtectedComponent requireScope='users:Get'>
                    <ButtonLink
                      to={`/users/${u.id}`}
                      variant='secondary'
                      className='w-full'
                    >
                      Open Profile
                    </ButtonLink>
                  </ProtectedComponent>
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
    </div>
  );
}
