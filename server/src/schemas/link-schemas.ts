import { z } from 'zod';

export const createLinkSchema = z.object({
  originalUrl: z.string().min(1, 'URL deve ser válida'),
  shortUrl: z.string().min(1, 'URL encurtada é obrigatória'),
});

export const getLinkByShortUrlSchema = z.object({
  shortUrl: z.string().min(1, 'URL encurtada é obrigatória'),
});

export const deleteLinkSchema = z.object({
  id: z.string().uuid('ID deve ser um UUID válido'),
});

export const incrementAccessSchema = z.object({
  id: z.string().uuid('ID deve ser um UUID válido'),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;
export type GetLinkByShortUrlInput = z.infer<typeof getLinkByShortUrlSchema>;
export type DeleteLinkInput = z.infer<typeof deleteLinkSchema>;
export type IncrementAccessInput = z.infer<typeof incrementAccessSchema>;
