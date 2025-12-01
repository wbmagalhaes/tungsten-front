import useHealthCheck from './hooks/useHealthCheck';

function App() {
  const { data, error, isLoading } = useHealthCheck();

  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-6'>
      <div className='shadow-xl rounded-2xl p-10 w-full max-w-lg text-center border'>
        <h1 className='text-3xl font-bold mb-4'>Tungsten Dashboard</h1>
        {isLoading && <p>Carregando...</p>}
        {error && <p>Erro ao conectar</p>}
        {data && (
          <pre className='bg-gray-100 p-4 rounded-xl text-left text-sm overflow-auto'>
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}

export default App;
