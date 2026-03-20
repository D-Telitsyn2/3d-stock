# 3D Stock - Premium 3D Models Marketplace

A modern marketplace for high-quality 3D models built with Next.js, NestJS, and React Native.

## 🏗️ Architecture

This is a monorepo built with Turborepo containing:

- **`apps/web`** - Next.js 14 frontend (App Router, Tailwind, Three.js)
- **`apps/mobile`** - Expo React Native mobile app
- **`apps/api`** - NestJS backend API (Prisma, PostgreSQL, Stripe)
- **`apps/worker`** - Background job processor (BullMQ, Redis)
- **`packages/ui`** - Shared UI components
- **`packages/sdk`** - API client and React Query hooks
- **`packages/schema`** - Zod validation schemas
- **`packages/config`** - Shared configuration (ESLint, TypeScript, Prettier)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 9+ (pnpm 8.x may hit registry fetch errors on some setups; use `corepack prepare pnpm@9.15.4 --activate` or `npx pnpm@9 install`)
- PostgreSQL database
- Redis instance
- Meilisearch instance

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd 3d-stock
```

2. Install dependencies (use **pnpm only** — do not run `npm install` in packages; the repo uses a single `pnpm-lock.yaml`):
```bash
pnpm install
```

3. Setup environment variables:
```bash
cp .env.example apps/api/.env
# Edit apps/api/.env — DATABASE_URL must match Postgres (see docker-compose)
cp apps/web/.env.example apps/web/.env.local
# В apps/web/.env.local укажи NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY и CLERK_SECRET_KEY (тот же инстанс, что и в apps/api/.env).
# Clerk: пути входа задаются в **`.env.local`** (`NEXT_PUBLIC_CLERK_SIGN_IN_URL`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL` — см. `apps/web/.env.example`). В Dashboard нет пункта «Allowed origins» с таким названием: смотри **[Paths](https://dashboard.clerk.com/~/paths)** (URL приложения, редиректы) и при необходимости **[Domains](https://dashboard.clerk.com/~/domains)**. Для **Development**-инстанса `http://localhost:3000` обычно уже допустим. Док: [Customize redirect URLs](https://clerk.com/docs/guides/development/customize-redirect-urls).
```

4. Start PostgreSQL and run migrations:
```bash
docker compose up -d postgres
pnpm db:migrate
pnpm db:seed
```

5. Start development servers:
```bash
pnpm dev
```

This will start:
- Web app at http://localhost:3000
- API server at http://localhost:3001
- API docs at http://localhost:3001/api/docs

## 📱 Mobile Development

```bash
cd apps/mobile
pnpm start
```

## 🛠️ Development

### Available Scripts

- `pnpm dev` - Start all development servers
- `pnpm build` - Build all applications
- `pnpm lint` - Lint all code
- `pnpm type-check` - TypeScript type checking
- `pnpm test` - Run all tests (`turbo test`: `@repo/api`, `@repo/schema`)
- `pnpm clean` - Clean build artifacts

### Database Commands

- `pnpm db:generate` - Generate Prisma client
- `pnpm db:migrate` - Run database migrations
- `pnpm db:seed` - Seed database with sample data
- `pnpm db:studio` - Open Prisma Studio

## 🔧 Configuration

### Environment Variables

See `.env.example` for all required environment variables.

Key services to configure:
- **Database**: PostgreSQL (recommend Neon)
- **Cache**: Redis (recommend Upstash)
- **Storage**: S3-compatible (Cloudflare R2 or AWS S3)
- **Auth**: Clerk
- **Payments**: Stripe Connect
- **Search**: Meilisearch

## 🏢 MVP Features

### For Users
- ✅ Browse 3D model catalog
- ✅ Search and filter models
- ✅ 3D model preview with controls
- ✅ Purchase models via Stripe
- ✅ Download purchased files
- ✅ Reviews and favorites

### For Sellers
- ✅ Stripe Connect onboarding
- ✅ Upload 3D models
- ✅ Model submission for moderation
- ✅ Sales dashboard
- ✅ Payout management

### For Admins
- ✅ Model moderation queue
- ✅ Approve/reject submissions
- ✅ Platform management

## 🧪 Testing

- **API** (`apps/api`): Vitest + Supertest; Nest DI через **unplugin-swc** (`vitest.config.ts`). Команды: `pnpm --filter @repo/api test`, `pnpm --filter @repo/api test:watch`.
- **Schema** (`packages/schema`): Vitest + Zod (`pnpm --filter @repo/schema test`).
- **Все тесты монорепо**: `pnpm test` (turbo).
- **CI**: GitHub Actions [`.github/workflows/ci.yml`](.github/workflows/ci.yml) — тесты + type-check (api, web, schema, sdk).
- E2E Playwright — запланировано (см. `docs/PROJECT_STATE.md`).

## 🚀 Deployment

### Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] S3 buckets created and configured
- [ ] Stripe webhooks configured
- [ ] Meilisearch index created
- [ ] CDN configured

### Recommended Stack

- **Web/API**: Vercel or Railway
- **Database**: Neon PostgreSQL
- **Cache**: Upstash Redis
- **Storage**: Cloudflare R2
- **Search**: Meilisearch Cloud
- **Mobile**: Expo EAS

## 📚 Documentation

- [API Documentation](http://localhost:3001/api/docs) (when running locally)
- [Project state & roadmap](./docs/PROJECT_STATE.md) (living doc — update in place)

## 🔄 Current Status

See **[docs/PROJECT_STATE.md](./docs/PROJECT_STATE.md)** for what is implemented and what is next. Cursor rules for the AI agent live in `.cursor/rules/`.

## 📝 License

Private - All rights reserved

## 🤝 Contributing

This is a private project. See [docs/PROJECT_STATE.md](./docs/PROJECT_STATE.md) and `.cursor/rules/`.
