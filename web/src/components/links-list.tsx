import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import CopyIcon from '../assets/copy.svg';
import { DownloadIcon } from '../assets/download';
import { LinkIcon } from '../assets/link';
import TrashIcon from '../assets/trash';
import { deleteLink, exportCsv, getLinks } from '../services/linkService';
import Button from './button';
import { SHORT_URL_PREFIX } from './link-form';

export default function LinksList() {
  const queryClient = useQueryClient();
  const {
    data: links,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['links'],
    queryFn: getLinks,
  });

  const { mutateAsync: mutateDelete } = useMutation({
    mutationFn: async (id: string) => await deleteLink(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
    },
  });

  async function handleExport() {
    try {
      const csvUrl = await exportCsv();
      const a = document.createElement('a');
      a.href = csvUrl;
      a.download = 'links.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success('CSV exportado!');
    } catch {
      toast.error('Erro ao exportar CSV');
    }
  }

  async function handleCopy(shortUrl: string) {
    const url = `${window.location.origin.replace(/\/$/, '')}/${shortUrl}`;
    await navigator.clipboard.writeText(url);
    toast.success('Link copiado!');
  }

  return (
    <div className='bg-gray-100 rounded-lg p-6 flex flex-col gap-4 w-full max-w-md min-h-[220px]'>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await handleExport();
        }}
        className='flex justify-between items-center border-b border-gray-200 pb-2'
      >
        <strong className='w-full'>Meus links</strong>
        <Button
          type='button'
          variant='secondary'
          disabled={!links || links.length === 0 || isLoading || isFetching}
          icon={<DownloadIcon color='#74798B' width={20} height={20} />}
          className='text-xs'
          onClick={handleExport}
        >
          Baixar CSV
        </Button>
      </form>
      {isLoading || isFetching ? (
        <div className='flex-1 flex items-center justify-center text-gray-400'>
          Carregando...
        </div>
      ) : !links || links.length === 0 ? (
        <div className='flex-1 flex flex-col items-center justify-center gap-2 text-gray-400'>
          <LinkIcon color='74798B' width={20} height={20} />
          Ainda não existem links cadastrados
        </div>
      ) : (
        <ul className='flex flex-col gap-2'>
          {links.map(
            (link: { id: string; originalUrl: string; shortUrl: string }) => (
              <li
                key={link.id}
                className='flex flex-col border-b border-gray-200 pb-2 last:border-b-0 last:pb-0'
              >
                <div className='flex items-center justify-between'>
                  <a
                    href={`https://${link.originalUrl}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-xs text-blue-700 hover:underline'
                  >
                    {SHORT_URL_PREFIX}
                    {link.shortUrl}
                  </a>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='secondary'
                      className='p-1 rounded hover:bg-gray-200 transition'
                      title='Copiar link'
                      type='button'
                      onClick={() => handleCopy(link.shortUrl)}
                    >
                      <img src={CopyIcon} alt='Copiar' className='w-4 h-4' />
                    </Button>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        await mutateDelete(link.id);
                      }}
                    >
                      <Button
                        variant='secondary'
                        type='button'
                        onClick={async () => await mutateDelete(link.id)}
                      >
                        <TrashIcon width={16} height={16} />
                      </Button>
                    </form>
                  </div>
                </div>
                <small className='text-gray-700'>{link.originalUrl}</small>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
}
