import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '@hooks/auth/use-login';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { mutateAsync, isPending, error, isError } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await mutateAsync({ username, password });

    const params = new URLSearchParams(location.search);
    const cbUrl = params.get('cb_url');
    navigate(cbUrl || '/overview', { replace: true });
  };

  return (
    <div className='max-w-md mx-auto mt-20 p-6 border rounded shadow'>
      <h1 className='text-2xl font-bold mb-4'>Login</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='text'
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className='border p-2 rounded'
          required
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='border p-2 rounded'
          required
        />
        <button
          type='submit'
          className='bg-blue-500 text-white p-2 rounded disabled:opacity-50'
          disabled={isPending}
        >
          {isPending ? 'Entrando...' : 'Login'}
        </button>
        {isError && <p className='text-red-500 mt-2'>{error.message}</p>}
      </form>
    </div>
  );
}
