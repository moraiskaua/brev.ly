import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Route, Routes } from 'react-router-dom';
import LinkForm from './components/link-form';
import LinksList from './components/links-list';
import NotFoundPage from './pages/NotFoundPage';
import RedirectPage from './pages/RedirectPage';

const queryClient = new QueryClient();

function Home() {
  return (
    <main className='min-h-screen bg-gray-200 flex flex-col'>
      <header className='p-8'>
        <img src='/src/assets/logo.svg' alt='brev.ly' className='h-8' />
      </header>
      <section className='flex-1 flex flex-col md:flex-row gap-8 justify-center items-center px-2'>
        <div className='bg-gray-100 rounded-lg p-8 w-full max-w-sm flex flex-col gap-6'>
          <strong>Novo link</strong>
          <LinkForm />
        </div>
        <div className='w-full max-w-md'>
          <LinksList />
        </div>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/redirect/:shortUrl' element={<RedirectPage />} />
        <Route path='/404' element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </QueryClientProvider>
  );
}
