import useDeleteFile from '@hooks/files/useDeleteFile';
import useListFiles from '@hooks/files/useListFiles';
import useUploadFile from '@hooks/files/useUploadFile';

export default function SystemDashboardPage() {
  const { data, isLoading, error } = useListFiles({});
  const uploadFile = useUploadFile();
  const deleteFile = useDeleteFile();

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadFile.mutate({
      file,
      dir: '',
      visibility: 'public',
    });

    e.target.value = '';
  };

  const handleDelete = (id: string) => {
    if (!confirm('Excluir este arquivo?')) return;
    deleteFile.mutate(id);
  };

  if (isLoading) return <p>Carregando...</p>;
  if (error || !data) return <p>Erro ao carregar dados</p>;

  return (
    <div className='grid grid-cols-1 gap-4'>
      <div className='bg-gray-900 p-4 rounded-sm shadow flex items-center justify-between'>
        <span className='font-medium'>MEDIA</span>

        <label className='cursor-pointer px-3 py-1 text-sm bg-blue-600 text-white rounded'>
          Upload
          <input type='file' className='hidden' onChange={handleUpload} />
        </label>
      </div>

      <div className='bg-gray-900 rounded-sm shadow overflow-x-auto'>
        <table className='min-w-full text-sm'>
          <thead className='border-b'>
            <tr>
              <th className='text-left px-3 py-2'>ID</th>
              <th className='text-left px-3 py-2'>Nome</th>
              <th className='text-left px-3 py-2'>Path</th>
              <th className='text-left px-3 py-2'>Tipo</th>
              <th className='text-right px-3 py-2'>Tamanho</th>
              <th className='text-left px-3 py-2'>Checksum</th>
              <th className='text-left px-3 py-2'>Criado em</th>
              <th className='text-left px-3 py-2'>Archived</th>
              <th className='text-right px-3 py-2'>Ações</th>
            </tr>
          </thead>

          <tbody>
            {data.results.map((file) => (
              <tr key={file.id} className='border-b last:border-b-0'>
                <td className='px-3 py-2'>{file.id}</td>
                <td className='px-3 py-2'>{file.basename}</td>
                <td className='px-3 py-2'>{file.filepath}</td>
                <td className='px-3 py-2'>{file.mime ?? '-'}</td>
                <td className='px-3 py-2 text-right'>
                  {(file.size / 1024).toFixed(1)} KB
                </td>
                <td className='px-3 py-2'>{file.checksum}</td>
                <td className='px-3 py-2'>
                  {new Date(file.created_at).toLocaleString()}
                </td>
                <td className='px-3 py-2'>
                  <input type='checkbox' checked={file.is_archived} />
                </td>
                <td className='px-3 py-2 text-right'>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className='text-red-600 hover:underline'
                    disabled={deleteFile.isPending}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {data.results.length === 0 && (
          <div className='p-4 text-sm text-gray-500'>Nenhum arquivo</div>
        )}
      </div>
    </div>
  );
}
