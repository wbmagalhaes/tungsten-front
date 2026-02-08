import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useListUsers } from '@hooks/users/use-list-users';
import { useCreateUser } from '@hooks/users/user-create-user';
import ProtectedComponent from '@components/ProtectedComponent';
import {
  UserPlus,
  Users,
  ChevronLeft,
  ChevronRight,
  Shield,
} from 'lucide-react';

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useListUsers({ page, page_size: 25 });
  const createUser = useCreateUser();

  function handleAddUser() {
    const username = prompt('Username:');
    const password = prompt('Password:');
    if (!username || !password) return;
    createUser.mutate({ username, password });
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-gray-400'>Loading users...</div>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='bg-gray-800 border border-gray-700 p-4 rounded-lg shadow-lg flex items-center justify-between'>
        <h1 className='text-xl font-semibold text-white flex items-center gap-2'>
          <Users className='w-5 h-5' />
          Users
        </h1>
        <ProtectedComponent requireScope='users:Create'>
          <button
            onClick={handleAddUser}
            className='px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2'
          >
            <UserPlus className='w-4 h-4' />
            <span className='hidden sm:inline'>Add User</span>
          </button>
        </ProtectedComponent>
      </div>

      {!data?.results.length ? (
        <div className='bg-gray-800 border border-gray-700 rounded-lg p-12 text-center'>
          <Users className='w-16 h-16 text-gray-600 mx-auto mb-4' />
          <p className='text-gray-400'>No users found</p>
        </div>
      ) : (
        <>
          <div className='hidden md:block bg-gray-800 border border-gray-700 rounded-lg overflow-hidden'>
            <table className='w-full text-sm'>
              <thead className='bg-gray-900 border-b border-gray-700'>
                <tr>
                  <th className='p-3 text-left text-gray-300 font-semibold'>
                    Username
                  </th>
                  <th className='p-3 text-left text-gray-300 font-semibold'>
                    Full Name
                  </th>
                  <th className='p-3 text-left text-gray-300 font-semibold'>
                    Email
                  </th>
                  <th className='p-3 text-left text-gray-300 font-semibold'>
                    Sudo
                  </th>
                  <th className='p-3 text-right text-gray-300 font-semibold'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.results.map((u) => (
                  <tr
                    key={u.id}
                    className='border-b border-gray-700 last:border-b-0 hover:bg-gray-750 transition-colors'
                  >
                    <td className='p-3 text-gray-200'>{u.username}</td>
                    <td className='p-3 text-gray-200'>{u.fullname || '-'}</td>
                    <td className='p-3 text-gray-200'>{u.email || '-'}</td>
                    <td className='p-3'>
                      {u.is_sudo ? (
                        <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-900/50 text-purple-400'>
                          <Shield className='w-3 h-3' />
                          Yes
                        </span>
                      ) : (
                        <span className='text-gray-400 text-sm'>No</span>
                      )}
                    </td>
                    <td className='p-3 text-right'>
                      <ProtectedComponent requireScope='users:Get'>
                        <Link
                          to={`/users/${u.id}`}
                          className='px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors inline-block'
                        >
                          Open
                        </Link>
                      </ProtectedComponent>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='md:hidden space-y-3'>
            {data.results.map((u) => (
              <div
                key={u.id}
                className='bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg'
              >
                <div className='flex items-start justify-between mb-3'>
                  <div className='flex-1 min-w-0'>
                    <h3 className='font-semibold text-white text-lg'>
                      {u.username}
                    </h3>
                    <div className='mb-0'>
                      <span className='text-xs text-gray-400'>Fullname:</span>
                      <p className='text-sm text-gray-200'>
                        {u.fullname || (
                          <span className='text-gray-500 italic'>
                            not informed
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {u.is_sudo && (
                    <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-900/50 text-purple-400 ml-2 shrink-0'>
                      <Shield className='w-3 h-3' />
                      Sudo
                    </span>
                  )}
                </div>

                <div className='mb-3'>
                  <span className='text-xs text-gray-400'>Email:</span>
                  <p className='text-sm text-gray-200'>
                    {u.email || (
                      <span className='text-gray-500 italic'>not informed</span>
                    )}
                  </p>
                </div>

                <ProtectedComponent requireScope='users:Get'>
                  <Link
                    to={`/users/${u.id}`}
                    className='block w-full px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm text-center transition-colors'
                  >
                    Open Profile
                  </Link>
                </ProtectedComponent>
              </div>
            ))}
          </div>
        </>
      )}

      {data && data.results.length > 0 && (
        <div className='flex items-center justify-between bg-gray-800 border border-gray-700 rounded-lg p-4'>
          <div className='text-sm text-gray-400'>
            Page {page} • {data.results.length} users
          </div>
          <div className='flex gap-2'>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className='px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2'
            >
              <ChevronLeft className='w-4 h-4' />
              <span className='hidden sm:inline'>Previous</span>
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!data.results.length || data.results.length < 25}
              className='px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2'
            >
              <span className='hidden sm:inline'>Next</span>
              <ChevronRight className='w-4 h-4' />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
