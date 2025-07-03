import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import logo from '../assets/logo.svg';

async function fetchShortUrl(shortUrl: string) {
  const { data } = await axios.get(
    `http://localhost:3333/api/links/${shortUrl}`
  );
  return data.data;
}

export default function RedirectPage() {
  const { shortUrl } = useParams();
  const navigate = useNavigate();

  const { data, isError } = useQuery({
    queryKey: ['redirect', shortUrl],
    queryFn: () => fetchShortUrl(shortUrl!),
    enabled: !!shortUrl,
    retry: false,
  });

  console.log(data);

  useEffect(() => {
    if (data) {
      const url = data.originalUrl.startsWith('http')
        ? data.originalUrl
        : `https://${data.originalUrl}`;
      setTimeout(() => {
        window.location.href = url;
      }, 1200);
    }
    if (isError) {
      navigate('/404', { replace: true });
    }
  }, [data, isError, navigate]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white rounded-lg p-10 flex flex-col items-center gap-4'>
        <img src={logo} alt='brev.ly' className='h-10' />
        <span className='text-lg font-semibold'>Redirecionando...</span>
        <span className='w-6 h-6 border-2 border-blue-700 border-t-transparent rounded-full animate-spin mt-2'></span>
      </div>
    </div>
  );
}
