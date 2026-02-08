import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import type { UpdateUserRequest } from '@services/users.service';
import { useUpdateSudo } from '@hooks/users/use-update-sudo';
import { useUpdateUser } from '@hooks/users/use-update-user';
import { useGetUser } from '@hooks/users/use-get-user';
import { useUpdatePermissions } from '@hooks/users/use-update-permissions';
import ProtectedComponent from '@components/ProtectedComponent';
import {
  ArrowLeft,
  User,
  Shield,
  Save,
  Mail,
  ImageIcon,
  UserCircle,
  Check,
  X,
  AlertTriangle,
  LockKeyholeOpen,
} from 'lucide-react';
import { useState } from 'react';

export default function SingleUserPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: user, isLoading } = useGetUser(id);
  const updateUser = useUpdateUser(id);
  const updatePerms = useUpdatePermissions(id);
  const updateSudo = useUpdateSudo(id);
  const form = useForm<UpdateUserRequest>({ values: user ?? {} });

  const [pendingScopes, setPendingScopes] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  if (isLoading || !user) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-gray-400'>Loading user...</div>
      </div>
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

  return (
    <div className='space-y-4 max-w-3xl mx-auto'>
      <button
        onClick={() => navigate('/users')}
        className='flex items-center gap-2 text-gray-400 hover:text-white transition-colors'
      >
        <ArrowLeft className='w-4 h-4' />
        Back to users
      </button>

      <div className='bg-gray-800 border border-gray-700 p-6 rounded-sm shadow-lg'>
        <div className='flex items-center gap-4'>
          <div className='w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center overflow-hidden'>
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className='w-full h-full object-cover'
              />
            ) : (
              <User className='w-6 h-6 text-white' />
            )}
          </div>
          <div>
            <h1 className='text-2xl font-semibold text-white'>
              {user.username}
            </h1>
            <p className='text-sm text-gray-400'>User Profile</p>
          </div>
        </div>
      </div>

      <div className='bg-gray-800 border border-gray-700 p-6 rounded-sm shadow-lg'>
        <h2 className='text-lg font-semibold text-white mb-4 flex items-center gap-2'>
          <UserCircle className='w-5 h-5' />
          Profile Information
        </h2>
        <form
          className='space-y-4'
          onSubmit={form.handleSubmit((v) => updateUser.mutate(v))}
        >
          <div>
            <label className='text-sm text-gray-400 mb-2 flex items-center gap-2'>
              <User className='w-4 h-4' />
              Full Name
            </label>
            <input
              className='w-full p-3 bg-gray-900 border border-gray-700 rounded-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600'
              placeholder='Enter full name'
              {...form.register('fullname')}
            />
          </div>

          <div>
            <label className='text-sm text-gray-400 mb-2 flex items-center gap-2'>
              <Mail className='w-4 h-4' />
              Email
            </label>
            <input
              type='email'
              className='w-full p-3 bg-gray-900 border border-gray-700 rounded-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600'
              placeholder='Enter email address'
              {...form.register('email')}
            />
          </div>

          <div>
            <label className='text-sm text-gray-400 mb-2 flex items-center gap-2'>
              <ImageIcon className='w-4 h-4' />
              Avatar URL
            </label>
            <input
              className='w-full p-3 bg-gray-900 border border-gray-700 rounded-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600'
              placeholder='Enter avatar URL'
              {...form.register('avatar')}
            />
          </div>

          <ProtectedComponent requireScope='users:Edit'>
            <button
              type='submit'
              className='w-full px-4 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-sm hover:shadow-lg transition-all flex items-center justify-center gap-2 font-medium'
            >
              <Save className='w-4 h-4' />
              Save Profile
            </button>
          </ProtectedComponent>
        </form>
      </div>

      <div className='bg-gray-800 border border-gray-700 p-6 rounded-sm shadow-lg'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-lg font-semibold text-white flex items-center gap-2'>
            <LockKeyholeOpen className='w-5 h-5' />
            Permissions
          </h2>
        </div>

        <div className='flex flex-wrap gap-2'>
          {ALL_SCOPES.map((scope) => {
            const active = displayScopes.includes(scope);
            return (
              <button
                key={scope}
                onClick={() => toggleScope(scope)}
                disabled={updatePerms.isPending}
                className={`px-3 py-1.5 rounded-sm text-sm font-medium border transition-all disabled:opacity-50 ${
                  active
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {scope}
              </button>
            );
          })}
        </div>

        {hasChanges && (
          <div className='my-4 p-3 bg-yellow-900/30 border border-yellow-700 rounded-sm text-yellow-400 text-sm flex gap-2'>
            <AlertTriangle />
            <span>
              You have unsaved changes. Click "Save" to apply or "Cancel" to
              discard.
            </span>
          </div>
        )}

        {hasChanges && (
          <div className='flex gap-2 justify-end'>
            <button
              onClick={savePermissions}
              disabled={updatePerms.isPending}
              className='px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-sm text-sm font-medium transition-colors flex items-center gap-1 disabled:opacity-50'
            >
              <Check className='w-4 h-4' />
              Save
            </button>
            <button
              onClick={cancelPermissions}
              disabled={updatePerms.isPending}
              className='px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-sm text-sm font-medium transition-colors flex items-center gap-1 disabled:opacity-50'
            >
              <X className='w-4 h-4' />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className='bg-gray-800 border border-gray-700 p-6 rounded-sm shadow-lg'>
        <h2 className='text-lg font-semibold text-white mb-4 flex items-center gap-2'>
          <Shield className='w-5 h-5' />
          Sudo Access
        </h2>
        <div className='flex items-center gap-3'>
          <div
            className={`px-4 py-2 rounded-sm text-sm font-medium flex items-center gap-2 ${
              user.is_sudo
                ? 'bg-green-900/50 text-green-400 border border-green-700'
                : 'bg-gray-900 text-gray-400 border border-gray-700'
            }`}
          >
            <Shield className='w-4 h-4' />
            {user.is_sudo ? 'Enabled' : 'Disabled'}
          </div>
          <ProtectedComponent requireScope='scope:GiveSudo'>
            <button
              onClick={() => updateSudo.mutate({ is_sudo: !user.is_sudo })}
              className='px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-sm transition-colors font-medium'
            >
              Toggle Sudo
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
