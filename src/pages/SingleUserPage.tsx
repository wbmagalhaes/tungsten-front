import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import type { UpdateUserRequest } from '@services/users.service';
import { useUpdateSudo } from '@hooks/users/use-update-sudo';
import { useUpdateUser } from '@hooks/users/use-update-user';
import { useGetUser } from '@hooks/users/use-get-user';
import { useUpdatePermissions } from '@hooks/users/use-update-permissions';
import ProtectedComponent from '@components/ProtectedComponent';

export default function SingleUserPage() {
  const { id = '' } = useParams();
  const { data: user, isLoading } = useGetUser(id);

  const updateUser = useUpdateUser(id);
  const updatePerms = useUpdatePermissions(id);
  const updateSudo = useUpdateSudo(id);

  const form = useForm<UpdateUserRequest>({ values: user ?? {} });

  if (isLoading || !user) return <div className='p-4'>Loading...</div>;

  const scopes = user.scope ?? [];

  return (
    <div className='p-4 space-y-6 max-w-xl'>
      <div>
        <h1 className='text-xl font-semibold'>User</h1>
        <h2 className='text-base'>{user.username}</h2>
      </div>

      <form
        className='space-y-3'
        onSubmit={form.handleSubmit((v) => updateUser.mutate(v))}
      >
        <input
          className='w-full p-2 bg-gray-800 rounded'
          placeholder='Full name'
          {...form.register('fullname')}
        />

        <input
          className='w-full p-2 bg-gray-800 rounded'
          placeholder='Email'
          {...form.register('email')}
        />

        <input
          className='w-full p-2 bg-gray-800 rounded'
          placeholder='Avatar'
          {...form.register('avatar')}
        />

        <ProtectedComponent requireScope='users:Edit'>
          <button className='px-4 py-2 bg-gray-700 rounded'>
            Save profile
          </button>
        </ProtectedComponent>
      </form>

      <div className='space-y-3'>
        <h2 className='font-semibold'>Permissions</h2>

        <div className='flex flex-wrap gap-2'>
          {ALL_SCOPES.map((scope) => {
            const active = scopes.includes(scope);

            return (
              <button
                key={scope}
                onClick={() => {
                  const next = active
                    ? scopes.filter((s) => s !== scope)
                    : [...scopes, scope];

                  updatePerms.mutate({ scope: next });
                }}
                className={`px-3 py-1 rounded-full text-sm border transition
            ${
              active
                ? 'bg-blue-700 border-blue-500'
                : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
            }
          `}
              >
                {scope}
              </button>
            );
          })}
        </div>
      </div>

      <div className='space-y-2'>
        <h2 className='font-semibold'>Sudo</h2>

        <div className='flex gap-3'>
          <div
            className={`px-3 py-2 rounded text-sm ${
              user.is_sudo ? 'bg-green-700' : 'bg-gray-700'
            }`}
          >
            {user.is_sudo ? 'enabled' : 'disabled'}
          </div>

          <ProtectedComponent requireScope='scope:GiveSudo'>
            <button
              onClick={() => updateSudo.mutate({ is_sudo: !user.is_sudo })}
              className='px-3 py-2 bg-gray-700 rounded'
            >
              Toggle sudo
            </button>
          </ProtectedComponent>
        </div>
      </div>
    </div>
  );
}

const ALL_SCOPES = [
  'system:*',
  'system:Read',
  'system:Edit',

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

  'notes:*',
  'templates:*',
  'sandbox:*',
  'chat-bot:*',
  'img-gen:*',
  'bg-jobs:*',
] as const;

export type ScopeValue = (typeof ALL_SCOPES)[number];
