import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import * as dotenv from 'dotenv';
import fastify from 'fastify';
import { linkRoutes } from './routes/link-routes';

dotenv.config();

const app = fastify({
  logger: true,
});

app.register(cors, { origin: true });
app.register(helmet);
app.register(rateLimit, { max: 100, timeWindow: '1 minute' });

app.register(linkRoutes, { prefix: '/api' });

app.get('/health', async () => {
  return { status: 'OK', timestamp: new Date().toISOString() };
});

app.setErrorHandler((error, request, reply) => {
  app.log.error(error);
  reply.status(500).send({ error: 'Erro interno do servidor' });
});

const start = async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3333;
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
