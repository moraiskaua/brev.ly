import { FastifyInstance } from 'fastify';
import { LinkController } from '../controllers/link-controller';

export async function linkRoutes(fastify: FastifyInstance) {
  const linkController = new LinkController();

  fastify.post('/links', {
    handler: linkController.createLink.bind(linkController),
  });

  fastify.get('/links', {
    handler: linkController.getAllLinks.bind(linkController),
  });

  fastify.get('/links/:shortUrl', {
    handler: linkController.getLinkByShortUrl.bind(linkController),
  });

  fastify.get('/:shortUrl', {
    handler: linkController.redirectToOriginalUrl.bind(linkController),
  });

  fastify.delete('/links/:id', {
    handler: linkController.deleteLink.bind(linkController),
  });

  fastify.patch('/links/:id/access', {
    handler: linkController.incrementAccess.bind(linkController),
  });

  fastify.get('/links/export/csv', {
    handler: linkController.exportCsv.bind(linkController),
  });
}
