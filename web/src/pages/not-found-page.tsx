import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white rounded-lg p-10 flex flex-col items-center gap-4'>
        <img src={logo} alt='brev.ly' className='h-10' />
        <h1 className='text-xl font-semibold'>Página não encontrada</h1>
        <p className='text-gray-500'>
          O link que você tentou acessar não existe.
        </p>
        <button
          className='mt-2 px-4 py-2 rounded bg-blue-700 text-white hover:bg-blue-800 transition'
          onClick={() => navigate('/')}
        >
          Voltar para a home
        </button>
      </div>
    </div>
  );
}
