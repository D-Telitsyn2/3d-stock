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
- pnpm 8+
- PostgreSQL database
- Redis instance
- Meilisearch instance

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd 3d-stock
```

2. Install dependencies:
```bash
pnpm install
```

3. Setup environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Setup database:
```bash
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
- `pnpm test` - Run all tests
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

- **Unit Tests**: Vitest
- **E2E Tests**: Playwright (web)
- **API Tests**: Supertest with NestJS

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
- [Project Instructions](./PROJECT_INSTRUCTIONS.md)

## 🔄 Current Status

🟡 **Phase 1**: Foundation & Infrastructure (IN PROGRESS)
- [x] Monorepo setup
- [x] Basic configurations
- [x] Database schema
- [ ] Basic API endpoints
- [ ] Authentication integration

## 📝 License

Private - All rights reserved

## 🤝 Contributing

This is a private project. See PROJECT_INSTRUCTIONS.md for development guidelines.
