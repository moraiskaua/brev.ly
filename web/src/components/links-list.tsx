import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
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
    console.log(shortUrl);
    const url = `${window.location.origin.replace(
      /\/$/,
      ''
    )}/redirect/${shortUrl}`;
    await navigator.clipboard.writeText(url);
    toast.success('Link copiado!');
  }

  console.log(links);

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
          className='w-full flex items-center justify-center gap-2 rounded-md px-1 py-3 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gray-200 text-gray-500 border border-transparent text-xs'
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
            (link: {
              id: string;
              originalUrl: string;
              shortUrl: string;
              accessCount: number;
            }) => (
              <li
                key={link.id}
                className='flex flex-col border-b border-gray-200 pb-2 last:border-b-0 last:pb-0'
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Link
                      to={`/redirect/${link.shortUrl}`}
                      className='text-xs text-blue-700 hover:underline'
                    >
                      {SHORT_URL_PREFIX}
                      {link.shortUrl}
                    </Link>
                    <span className='text-xs text-gray-500'>
                      ({link.accessCount})
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='secondary'
                      title='Copiar link'
                      onClick={async () => await handleCopy(link.shortUrl)}
                    >
                      <img src={CopyIcon} alt='Copiar' className='size-4' />
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
