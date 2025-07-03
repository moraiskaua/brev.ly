import { Link } from 'react-router-dom';
import NotFoundIcon from '../assets/404.svg';

export default function NotFoundPage() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-200'>
      <div className='bg-gray-100 rounded-lg p-10 flex flex-col items-center gap-4 max-w-md w-full'>
        <img
          src={NotFoundIcon}
          alt='404'
          className='w-32 h-20 mb-2 select-none pointer-events-none'
          draggable={false}
        />
        <h1 className='text-2xl font-bold text-center mt-2'>
          Link não encontrado
        </h1>
        <p className='text-center text-gray-500 text-sm'>
          O link que você está tentando acessar não existe, foi removido ou é
          uma URL inválida. Saiba mais em{' '}
          <Link to='/' className='text-blue-700 underline'>
            brev.ly
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
