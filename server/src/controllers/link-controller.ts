import { FastifyReply, FastifyRequest } from 'fastify';
import {
  CreateLinkInput,
  createLinkSchema,
  DeleteLinkInput,
  deleteLinkSchema,
  GetLinkByShortUrlInput,
  getLinkByShortUrlSchema,
  IncrementAccessInput,
  incrementAccessSchema,
} from '../schemas/link-schemas';
import { CsvService } from '../services/csv-service';
import { LinkService } from '../services/link-service';

export class LinkController {
  private linkService: LinkService;
  private csvService: CsvService;

  constructor() {
    this.linkService = new LinkService();
    this.csvService = new CsvService();
  }

  async createLink(
    request: FastifyRequest<{ Body: CreateLinkInput }>,
    reply: FastifyReply
  ) {
    try {
      const data = createLinkSchema.parse(request.body);
      const link = await this.linkService.createLink(data);
      return reply.status(201).send({
        message: 'Link criado com sucesso',
        data: link,
      });
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(400).send({ error: error.message });
      }
      return reply.status(500).send({ error: 'Erro interno do servidor' });
    }
  }

  async getAllLinks(request: FastifyRequest, reply: FastifyReply) {
    try {
      const links = await this.linkService.getAllLinks();
      return reply.status(200).send({ data: links });
    } catch (error) {
      return reply.status(500).send({ error: 'Erro interno do servidor' });
    }
  }

  async getLinkByShortUrl(
    request: FastifyRequest<{ Params: GetLinkByShortUrlInput }>,
    reply: FastifyReply
  ) {
    try {
      const { shortUrl } = getLinkByShortUrlSchema.parse(request.params);
      const link = await this.linkService.getLinkByShortUrl(shortUrl);
      if (!link) {
        return reply.status(404).send({ error: 'Link não encontrado' });
      }
      return reply.status(200).send({ data: link });
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(400).send({ error: error.message });
      }
      return reply.status(500).send({ error: 'Erro interno do servidor' });
    }
  }

  async redirectToOriginalUrl(
    request: FastifyRequest<{ Params: GetLinkByShortUrlInput }>,
    reply: FastifyReply
  ) {
    try {
      const { shortUrl } = getLinkByShortUrlSchema.parse(request.params);
      const link = await this.linkService.getLinkByShortUrl(shortUrl);
      if (!link) {
        return reply.status(404).send({ error: 'Link não encontrado' });
      }
      await this.linkService.incrementAccess({ id: link.id });
      return reply.redirect(link.originalUrl);
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(400).send({ error: error.message });
      }
      return reply.status(500).send({ error: 'Erro interno do servidor' });
    }
  }

  async deleteLink(
    request: FastifyRequest<{ Params: DeleteLinkInput }>,
    reply: FastifyReply
  ) {
    try {
      const data = deleteLinkSchema.parse(request.params);
      const deletedLink = await this.linkService.deleteLink(data);
      if (!deletedLink) {
        return reply.status(404).send({ error: 'Link não encontrado' });
      }
      return reply.status(200).send({
        message: 'Link deletado com sucesso',
        data: deletedLink,
      });
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(400).send({ error: error.message });
      }
      return reply.status(500).send({ error: 'Erro interno do servidor' });
    }
  }

  async incrementAccess(
    request: FastifyRequest<{ Params: IncrementAccessInput }>,
    reply: FastifyReply
  ) {
    try {
      const data = incrementAccessSchema.parse(request.params);
      const updatedLink = await this.linkService.incrementAccess(data);
      if (!updatedLink) {
        return reply.status(404).send({ error: 'Link não encontrado' });
      }
      return reply.status(200).send({
        message: 'Acesso incrementado com sucesso',
        data: updatedLink,
      });
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(400).send({ error: error.message });
      }
      return reply.status(500).send({ error: 'Erro interno do servidor' });
    }
  }

  async exportCsv(request: FastifyRequest, reply: FastifyReply) {
    try {
      const links = await this.linkService.getAllLinks();
      const csvUrl = await this.csvService.generateAndUploadCsv(links);
      return reply.status(200).send({
        message: 'CSV gerado e enviado com sucesso',
        data: {
          csvUrl,
          totalLinks: links.length,
        },
      });
    } catch (error) {
      return reply.status(500).send({ error: 'Erro interno do servidor' });
    }
  }
}
