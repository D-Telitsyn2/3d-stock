# 3D Stock Models Marketplace - Development Instructions

## PROJECT OVERVIEW
Создаем маркетплейс 3D-моделей с монорепозиторием, поддержкой web и mobile, платежами через Stripe Connect и 3D-просмотром.

## MVP PRIORITIES (Поэтапная разработка)

### PHASE 1: Foundation & Infrastructure 🏗️
- [x] Bootstrap Turborepo monorepo structure
- [ ] Setup basic configs (TypeScript, ESLint, Prettier)
- [ ] Database schema & migrations (Prisma + PostgreSQL)
- [ ] Basic NestJS API with authentication

### PHASE 2: Core Backend 🔧
- [ ] Asset CRUD operations
- [ ] File upload pipeline (S3/R2 presigned URLs)
- [ ] Basic worker setup for background tasks
- [ ] OpenAPI documentation & SDK generation

### PHASE 3: Frontend Foundation 🎨
- [ ] Next.js web app with basic layout
- [ ] Authentication integration (Clerk)
- [ ] Basic catalog and asset listing
- [ ] 3D viewer implementation (Three.js)

### PHASE 4: Business Logic 💰
- [ ] Stripe Connect integration for sellers
- [ ] Payment processing and checkout
- [ ] Download protection and access control
- [ ] Basic seller dashboard

### PHASE 5: Mobile & Search 📱
- [ ] Expo mobile app setup
- [ ] WebView integration for 3D viewing
- [ ] Meilisearch integration
- [ ] Advanced search functionality

### PHASE 6: Admin & Polish ⚙️
- [ ] Admin panel for moderation
- [ ] Testing setup (unit, integration, E2E)
- [ ] CI/CD pipelines
- [ ] Documentation and deployment

## CORE TECHNICAL DECISIONS

### Architecture
- **Monorepo**: Turborepo + pnpm
- **Backend**: NestJS + Prisma + PostgreSQL
- **Frontend**: Next.js 14 (App Router) + TailwindCSS
- **Mobile**: Expo + React Native
- **Storage**: S3-compatible (R2/AWS) + CDN
- **Search**: Meilisearch
- **Payments**: Stripe Connect (15% platform fee)
- **Auth**: Clerk (web + mobile)

### MVP Assumptions
- Currency: EUR default
- Languages: EN/RU (i18n)
- File formats: GLB/GLTF, OBJ+MTL
- Mobile 3D: WebView embedding web viewer
- Single seller per cart (MVP limitation)
- Commission: 15% platform fee

### Security & Quality
- TypeScript strict mode
- Zod validation schemas
- Rate limiting and CORS protection
- Signed URLs for downloads
- E2E testing with Playwright

## FOLDER STRUCTURE
```
repo/
  apps/
    web/           # Next.js 14 frontend
    mobile/        # Expo React Native
    api/           # NestJS backend
    worker/        # Background jobs (BullMQ)
    admin/         # Admin panel
  packages/
    ui/            # Shared UI components
    config/        # Shared configs
    sdk/           # API client & types
    schema/        # Zod validation schemas
  infra/
    docker/        # Docker configs
    github/        # CI/CD workflows
    scripts/       # Dev scripts
```

## DEVELOPMENT WORKFLOW

### Starting Development
1. `pnpm install` - Install dependencies
2. Setup environment variables (copy from .env.example)
3. `pnpm db:migrate` - Run database migrations
4. `pnpm db:seed` - Seed initial data
5. `pnpm dev` - Start all development servers

### Code Standards
- Conventional Commits
- TypeScript strict, no `any`
- Feature-based modules
- Minimal dependencies
- Clean separation of concerns

### Testing Strategy
- Unit tests: Vitest
- E2E tests: Playwright
- API contracts: OpenAPI + Zod
- Mobile: Expo testing tools

## ACCEPTANCE CRITERIA (MVP)

### User Journey
✅ User can register/login (web + mobile)
✅ Browse catalog with search and filters
✅ View 3D model preview with controls
✅ Purchase model via Stripe Checkout
✅ Download purchased files
✅ Leave reviews and favorites

### Seller Journey
✅ Connect Stripe account (onboarding)
✅ Upload large 3D files via presigned URLs
✅ Submit models for moderation
✅ View sales dashboard and payouts

### Admin Journey
✅ Moderate submitted models
✅ Approve/reject with reasons
✅ Manage platform content

### Technical Requirements
✅ Lighthouse score ≥ 80
✅ All tests passing
✅ Proper error handling
✅ Security best practices
✅ Mobile responsiveness

## CURRENT STATUS
Starting with Phase 1: Foundation & Infrastructure

## NEXT STEPS
1. Create monorepo structure
2. Setup basic configurations
3. Initialize database schema
4. Create basic API structure
