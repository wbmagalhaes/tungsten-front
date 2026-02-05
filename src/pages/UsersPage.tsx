import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUsers, useCreateUser } from '@hooks/users/use-users';
import ProtectedComponent from '@components/ProtectedComponent';

export default function UsersPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useUsers({ page, page_size: 25 });
  const createUser = useCreateUser();

  function handleAddUser() {
    const username = prompt('username');
    const password = prompt('password');

    if (!username || !password) return;

    createUser.mutate({ username, password });
  }

  if (isLoading) return <div className='p-4'>Loading...</div>;

  return (
    <div className='p-4 space-y-4'>
      <div className='flex items-center'>
        <h1 className='text-xl font-semibold'>Users</h1>

        <ProtectedComponent requireScope='users:Create'>
          <button
            onClick={handleAddUser}
            className='ml-auto px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600'
          >
            Add user
          </button>
        </ProtectedComponent>
      </div>

      <table className='w-full text-sm border-gray-700 rounded-sm overflow-hidden'>
        <thead className='bg-gray-800'>
          <tr>
            <th className='p-2 text-left'>Username</th>
            <th className='p-2 text-left'>Full name</th>
            <th className='p-2 text-left'>Email</th>
            <th className='p-2 text-left'>Sudo</th>
            <th className='p-2' />
          </tr>
        </thead>

        <tbody>
          {data?.results.map((u) => (
            <tr key={u.id} className='border-t border-gray-700'>
              <td className='p-2'>{u.username}</td>
              <td className='p-2'>{u.fullname}</td>
              <td className='p-2'>{u.email}</td>
              <td className='p-2'>{u.is_sudo ? 'yes' : 'no'}</td>

              <td className='p-2 text-right'>
                <ProtectedComponent requireScope='users:Get'>
                  <Link
                    to={`/users/${u.id}`}
                    className='px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600'
                  >
                    Open
                  </Link>
                </ProtectedComponent>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className='flex gap-2'>
        <button onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
        <button onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
    </div>
  );
}
