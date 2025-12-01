import useHealthCheck from './hooks/useHealthCheck';

export default function App() {
  const { data, isLoading, error } = useHealthCheck();

  if (isLoading) return <p className='p-6'>Carregando...</p>;
  if (error || !data) return <p className='p-6'>Erro ao carregar dados</p>;

  return (
    <div className='min-h-screen p-6 bg-gray-50 font-sans'>
      <div className='max-w-6xl mx-auto'>
        <h1 className='text-4xl font-bold mb-6 text-left'>Tungsten</h1>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='bg-white p-6 rounded-xl shadow col-span-full'>
            <h2 className='font-semibold text-xl mb-2'>Sistema</h2>
            <p>Hostname: {data.hostname}</p>
            <p>OS: {data.os_version}</p>
            <p>Kernel: {data.kernel_version}</p>
            <p>
              Uptime: {Math.floor(data.uptime / 3600)}h{' '}
              {Math.floor(data.uptime / 60) % 60}m
            </p>
            <p>Data atual: {new Date(data.current_time).toLocaleString()}</p>
          </div>

          <div className='bg-white p-6 rounded-xl shadow'>
            <h2 className='font-semibold text-xl mb-2'>CPU</h2>
            <p>Uso: {data.cpu_usage.toFixed(0)}%</p>
            <h3 className='mt-4 font-semibold'>Componentes:</h3>
            <ul className='ml-4 list-disc'>
              {data.comp_temps
                .sort((a, b) => a.label.localeCompare(b.label))
                .map((c) => (
                  <li key={c.label}>
                    {c.label}: {c.temperature.toFixed(1)}°C
                  </li>
                ))}
            </ul>
          </div>

          <div className='bg-white p-6 rounded-xl shadow'>
            <h2 className='font-semibold text-xl mb-2'>
              GPU ({data.gpu_vendor})
            </h2>
            <p>Uso: {data.gpu_usage}%</p>
            <p>Temperatura: {data.gpu_temp.toFixed(1)}°C</p>
          </div>

          <div className='bg-white p-6 rounded-xl shadow'>
            <h2 className='font-semibold text-xl mb-2'>Memória</h2>
            <p>
              {(data.mem_used / 1024 ** 3).toFixed(2)} GB /{' '}
              {(data.mem_total / 1024 ** 3).toFixed(2)} GB
            </p>
          </div>

          <div className='bg-white p-6 rounded-xl shadow'>
            <h2 className='font-semibold text-xl mb-2'>Disco</h2>
            <p>
              {(data.disk_used / 1024 ** 3).toFixed(2)} GB /{' '}
              {(data.disk_total / 1024 ** 3).toFixed(2)} GB
            </p>
          </div>

          <div className='bg-white p-6 rounded-xl shadow'>
            <h2 className='font-semibold text-xl mb-2'>Rede</h2>
            <p>Entrada: {(data.net_in / 1024 ** 2).toFixed(2)} MB</p>
            <p>Saída: {(data.net_out / 1024 ** 2).toFixed(2)} MB</p>
          </div>

          <div className='bg-white p-6 rounded-xl shadow'>
            <h2 className='font-semibold text-xl mb-2'>Bateria</h2>
            <p>
              {data.battery_percent.toFixed(0)}% - {data.battery_status}
              {data.battery_hours_left >= 0 && (
                <p>Tempo restante: {data.battery_hours_left.toFixed(2)} h</p>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
