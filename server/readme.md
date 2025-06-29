# Brev.ly - API de Encurtamento de URLs

API completa para gerenciamento de encurtamento de URLs com TypeScript, Fastify, Drizzle e PostgreSQL.

## 🚀 Setup Rápido

### 1. Clone e entre na pasta
```bash
cd server
```

### 2. Execute o setup
```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### 3. Configure as variáveis de ambiente
```bash
cp env.example .env
# Edite o arquivo .env com suas configurações
```

### 4. Execute as migrations
```bash
npm run db:migrate
```

### 5. Inicie o servidor
```bash
npm run dev
```

## 📋 Variáveis de Ambiente

Configure o arquivo `.env`:

```env
PORT=3333
DATABASE_URL="postgresql://username:password@localhost:5432/brev_ly"

CLOUDFLARE_ACCOUNT_ID=""
CLOUDFLARE_ACCESS_KEY_ID=""
CLOUDFLARE_SECRET_ACCESS_KEY=""
CLOUDFLARE_BUCKET=""
CLOUDFLARE_PUBLIC_URL=""
```

## 🐳 Docker (Opcional)

```bash
docker-compose up -d
```

## 📚 Endpoints

### Base URL: `http://localhost:3333/api`

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/links` | Criar link |
| GET | `/links` | Listar links |
| GET | `/links/:shortUrl` | Buscar link |
| DELETE | `/links/:id` | Deletar link |
| PATCH | `/links/:id/access` | Incrementar acessos |
| GET | `/links/export/csv` | Exportar CSV |
| GET | `/:shortUrl` | Redirecionar |
| GET | `/health` | Health check |

## 🧪 Testando a API

### 1. Health Check
```bash
curl http://localhost:3333/health
```

### 2. Criar um link
```bash
curl -X POST http://localhost:3333/api/links \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://www.google.com"}'
```

### 3. Listar links
```bash
curl http://localhost:3333/api/links
```

### 4. Exportar CSV
```bash
curl http://localhost:3333/api/links/export/csv
```

## 📁 Estrutura

```
src/
├── database/
│   ├── connection.ts
│   └── schema.ts
├── controllers/
│   └── link-controller.ts
├── services/
│   ├── link-service.ts
│   └── csv-service.ts
├── routes/
│   └── link-routes.ts
├── schemas/
│   └── link-schemas.ts
├── utils/
│   └── generate-short-url.ts
└── server.ts
```

## 🔧 Scripts

- `npm run dev` - Desenvolvimento
- `npm run build` - Build
- `npm run start` - Produção
- `npm run db:migrate` - Migrations
- `npm run db:studio` - Drizzle Studio

## ✅ Funcionalidades

- ✅ Criar links com URLs únicas
- ✅ Listar todos os links
- ✅ Buscar por URL encurtada
- ✅ Deletar links
- ✅ Incrementar contador de acessos
- ✅ Redirecionamento automático
- ✅ Exportação CSV para Cloudflare R2
- ✅ Validação de entrada
- ✅ Rate limiting
- ✅ CORS configurado
- ✅ Headers de segurança

## 🛠️ Tecnologias Utilizadas

- **TypeScript** - Linguagem de programação
- **Fastify** - Framework web
- **Drizzle** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **Zod** - Validação de schemas
- **Cloudflare R2** - Armazenamento de arquivos CSV
- **Docker** - Containerização

## 📄 Licença

MIT