# Estágio de build
FROM node:18-alpine AS builder

WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./
COPY tsconfig.json ./
COPY drizzle.config.ts ./

# Instala todas as dependências
RUN npm ci

# Copia o código fonte
COPY src/ ./src/

# Compila o TypeScript
RUN npm run build

# Estágio de produção
FROM node:18-alpine AS production

WORKDIR /app

# Instala apenas as dependências de produção
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copia os arquivos compilados
COPY --from=builder /app/dist ./dist

# Cria usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Muda a propriedade dos arquivos para o usuário nodejs
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expõe a porta
EXPOSE 3333

# Define variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3333

# Comando para iniciar a aplicação
CMD ["node", "dist/server.js"] 