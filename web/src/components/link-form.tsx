import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createLink } from '../services/linkService';
import Button from './button';
import Input from './input';

export const SHORT_URL_PREFIX = 'brev.ly/';

const schema = z.object({
  originalUrl: z.string().min(1, 'URL inválida'),
  shortUrl: z
    .string()
    .min(1, 'Obrigatório')
    .regex(/^[a-zA-Z0-9-_]+$/, 'Apenas letras, números, - e _'),
});

type FormData = z.infer<typeof schema>;

export default function LinkForm() {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { originalUrl: '', shortUrl: '' },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: FormData) =>
      await createLink(data.originalUrl, data.shortUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      reset();
    },
  });

  async function onSubmit(data: FormData) {
    await mutateAsync(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
      <Input
        label='LINK ORIGINAL'
        placeholder='www.exemplo.com.br'
        error={errors.originalUrl?.message}
        disabled={isPending}
        {...register('originalUrl')}
      />
      <div className='flex flex-col gap-1'>
        <label className='text-xs font-medium text-gray-700 mb-1'>
          LINK ENCURTADO
        </label>
        <div className='flex items-center w-full max-w-xs'>
          <span className='rounded-l-md bg-gray-200 border border-r-0 border-gray-200 px-3 py-2 text-gray-400 text-sm select-none'>
            {SHORT_URL_PREFIX}
          </span>
          <input
            className={`block w-full rounded-r-md border border-gray-200 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-base transition ${
              errors.shortUrl ? 'border-red-500 ring-2 ring-red-500' : ''
            }`}
            disabled={isPending}
            {...register('shortUrl')}
            autoComplete='off'
          />
        </div>
        {errors.shortUrl && (
          <span className='flex items-center gap-1 mt-1 text-xs text-red-500'>
            <svg width='14' height='14' fill='none' viewBox='0 0 24 24'>
              <path
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            {errors.shortUrl.message}
          </span>
        )}
      </div>
      <Button type='submit' disabled={isPending}>
        Salvar link
      </Button>
    </form>
  );
}
