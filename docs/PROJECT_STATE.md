# Состояние проекта 3D Stock

**Единственный живой документ** про прогресс и планы. При изменении архитектуры, завершении этапов или сдвиге приоритетов — **редактируй этот файл**, не добавляй новые `STATUS*.md` / отчёты в корень.

_Последнее обновление: 2026-03-21 — Clerk end-to-end проверен_

---

## Продукт

Маркетплейс 3D-моделей: каталог, превью, покупки (Stripe Connect), роли пользователь / продавец / админ, модерация, поиск (Meilisearch), web (Next.js) + mobile (Expo).

---

## Стек (зафиксировано)

| Область | Выбор |
|--------|--------|
| Монорепо | Turborepo, **pnpm 9+** (`pnpm-workspace.yaml`), без `package-lock.json` в пакетах |
| API | NestJS 10, Prisma, PostgreSQL |
| Web | Next.js 14 App Router, Tailwind |
| Mobile | Expo |
| Валидация / контракты | Zod в `packages/schema`, клиент в `packages/sdk` |
| Инфра локально | `docker-compose.yml`: Postgres, Redis, Meilisearch |

---

## Что уже есть

- [x] Монорепо и workspace (`apps/*`, `packages/*`).
- [x] Prisma-схема под маркетплейс; **PostgreSQL**; миграция `20250321120000_init`; сид `prisma/seed.ts` (продавец + опубликованные ассеты).
- [x] Nest: `ConfigModule`, `PrismaModule`, `HealthModule`, глобальный `ValidationPipe`, **Swagger** на `/api/docs`, CORS, корневая HTML-страница и `GET /health.txt`.
- [x] Публичный каталог API: **`GET /assets`** (только `status = PUBLISHED`, пагинация).
- [x] Web: главная, **`/catalog`** через `@repo/sdk` (`listAssets`), `dynamic = 'force-dynamic'` для сборки без API.
- [x] **Clerk — проверено**: web (`@clerk/nextjs` 5.x): `ClerkProvider`, `middleware`, `/sign-in`, `/sign-up`, шапка, **`/account`** → API **`GET /users/me`** (JWT) → upsert в `users`. API: `ClerkAuthGuard`, `verifyToken`, Swagger **Bearer** (`clerk-jwt`); ключи в `apps/api/.env` и `apps/web/.env.local`.
- [x] Пакеты: `@repo/schema` (в т.ч. Zod для ответа каталога), `@repo/sdk`, `@repo/ui`, `@repo/config`.
- [x] Документация в README: env для `apps/api` и `apps/web`, Paths Clerk, docker для Postgres.

## Чего нет или заготовки

- [ ] Clerk **webhooks** (`user.created` / `user.updated`) для фона без первого захода на `/account`.
- [ ] Роли/права продавца на основе `users.role` + защита seller-эндпоинтов.
- [ ] CRUD ассетов для продавца, загрузка файлов (S3/R2 presigned), worker (BullMQ).
- [ ] Stripe Connect, чекаут, webhooks, выдача скачиваний.
- [ ] Meilisearch в коде, админ-модерация, полноценный UI каталога/карточки, **Three.js** просмотр.
- [ ] Mobile: только каркас Expo.
- [x] **Тесты**: Vitest + Supertest в `apps/api` (health, `/`, `/health.txt`, `/assets`, `/users/me` 401); Vitest + Zod в `packages/schema` (`PaginatedPublicAssetsSchema`). **SWC** в `vitest.config` API — `emitDecoratorMetadata` для Nest DI.
- [x] **CI**: GitHub Actions `.github/workflows/ci.yml` — `pnpm install --frozen-lockfile`, `turbo test` (@repo/api, @repo/schema), `turbo type-check` (api, web, schema, sdk).
- [ ] E2E Playwright (web), интеграционные тесты с реальной БД — по желанию.

---

## Ближайшие приоритеты (рекомендуемый порядок)

1. **Auth (дальше)**: webhooks Clerk; `getMe` в `@repo/sdk`; настройки redirect URL в Clerk Dashboard под локальные `/sign-in`, `/sign-up`.
2. **Ассеты (seller)**: создание черновика, presigned upload, смена статусов, модерация (минимум).
3. **Stripe Connect** и покупка одной позиции (MVP).
4. **Поиск**: индексация в Meilisearch, запрос из API и web.
5. **3D viewer** на web; mobile через WebView при необходимости.

---

## Команды для проверки

```bash
docker compose up -d postgres
# apps/api/.env — DATABASE_URL под Postgres
pnpm --filter @repo/api exec prisma migrate deploy
pnpm --filter @repo/api db:seed
pnpm dev
# API: http://localhost:3001  Swagger: /api/docs
# Web: http://localhost:3000/catalog
```

---

## Заметки

- Установка зависимостей: предпочтительно **`npx pnpm@9.x install`**, если глобальный pnpm 8 падает с ошибкой registry (`ERR_INVALID_THIS`).
- Env: см. корневой `.env.example`, `apps/web/.env.example`; для Nest/Prisma в dev удобно **`apps/api/.env`**.
