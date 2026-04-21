# Архитектура 3D Stock в диаграммах

Визуализация кодовой базы монорепо: из чего состоит, как связаны приложения и пакеты, как течёт трафик, какая модель данных. Диаграммы — Mermaid, рендерятся GitHub/VS Code из коробки.

> Статус реализации каждого блока — в [docs/PROJECT_STATE.md](./PROJECT_STATE.md). Этот файл описывает **структуру**, а не прогресс.

---

## 1. Монорепо верхнего уровня

Turborepo + pnpm workspace. Всё живёт под `apps/*` (разворачиваемые сервисы и клиенты) и `packages/*` (переиспользуемый код).

```mermaid
flowchart TB
    Root["3d-stock-marketplace<br/>pnpm + Turborepo"]

    subgraph Apps["apps/*"]
        Web["@repo/web<br/>Next.js 14 · App Router"]
        API["@repo/api<br/>NestJS 10 + Prisma"]
        Worker["@repo/worker<br/>BullMQ · Puppeteer"]
        Mobile["@repo/mobile<br/>Expo · expo-router"]
    end

    subgraph Packages["packages/*"]
        Schema["@repo/schema<br/>Zod контракты"]
        SDK["@repo/sdk<br/>Typed API client"]
        UI["@repo/ui<br/>React-компоненты"]
        Config["@repo/config<br/>eslint / tsconfig / prettier"]
    end

    Root --> Apps
    Root --> Packages
```

---

## 2. Граф зависимостей пакетов

Стрелка — «импортирует». Контракты (`@repo/schema`) — центр схемы: на них опирается и API, и SDK, и веб.

```mermaid
flowchart LR
    subgraph apps
        Web["@repo/web"]
        API["@repo/api"]
        Worker["@repo/worker"]
        Mobile["@repo/mobile"]
    end

    subgraph packages
        Schema["@repo/schema"]
        SDK["@repo/sdk"]
        UI["@repo/ui"]
        Config["@repo/config"]
    end

    Web -->|listAssets, types| SDK
    Web -->|Zod types| Schema
    Web -.->|shared components| UI
    SDK --> Schema
    API -.->|validation DTO ↔ Zod| Schema
    Worker -->|tsconfig| Config
    Web -.->|eslint/ts config| Config
    API -.->|eslint/ts config| Config

    classDef ext fill:#eef,stroke:#88a
    classDef pkg fill:#efe,stroke:#4a4
    class Web,API,Worker,Mobile ext
    class Schema,SDK,UI,Config pkg
```

---

## 3. Инфраструктура и внешние сервисы

Картина продакшена/локалки из `docker-compose.yml` и `.env.example`: Postgres — основное хранилище, Redis — очереди/кэш, Meilisearch — поиск, S3-совместимое хранилище — бинарники ассетов. Clerk делает auth, Stripe Connect — платежи.

```mermaid
flowchart LR
    Browser["Browser / Expo"]

    subgraph Edge["Frontends"]
        Web["@repo/web<br/>Next.js :3000"]
        Mobile["@repo/mobile<br/>Expo"]
    end

    subgraph Backend["Backend"]
        API["@repo/api<br/>Nest :3001<br/>/api/docs"]
        Worker["@repo/worker<br/>BullMQ consumers"]
    end

    subgraph Data["Data & infra (docker-compose)"]
        PG[("PostgreSQL 15<br/>3d_stock_dev")]
        Redis[("Redis 7")]
        Meili[("Meilisearch v1.4")]
        S3[("S3 / Cloudflare R2")]
    end

    subgraph SaaS["External SaaS"]
        Clerk(("Clerk<br/>auth"))
        Stripe(("Stripe Connect<br/>payments"))
    end

    Browser --> Web
    Browser --> Mobile
    Web -->|REST JSON| API
    Mobile -.->|REST JSON| API
    Web --> Clerk
    API --> Clerk

    API --> PG
    API --> Redis
    API -.-> Meili
    API --> S3
    API --> Stripe

    Worker --> Redis
    Worker --> PG
    Worker --> S3

    Stripe -.->|webhooks| API
    Clerk -.->|webhooks planned| API
```

---

## 4. Модули API (NestJS)

`apps/api/src/app.module.ts` собирает 6 модулей. `PrismaModule` — единственная точка доступа к БД; `AuthModule` выдаёт `ClerkAuthGuard`, которым защищаются приватные эндпоинты.

```mermaid
flowchart TB
    App[AppModule]

    App --> Config[ConfigModule.forRoot<br/>isGlobal]
    App --> Prisma[PrismaModule<br/>PrismaService]
    App --> Auth[AuthModule<br/>ClerkAuthGuard]
    App --> Health[HealthModule<br/>GET /health]
    App --> Assets[AssetsModule<br/>GET /assets]
    App --> Users[UsersModule<br/>GET /users/me]

    Assets --> Prisma
    Users --> Prisma
    Users --> Auth
    Health --> Prisma

    App --> AppCtrl["AppController<br/>GET /, GET /health.txt"]
```

---

## 5. Поток запроса: каталог

От перехода на `/catalog` в браузере до ответа из Postgres. Next.js рендерит серверно, зовёт API через SDK, ответ валидируется Zod-схемой из `@repo/schema`.

```mermaid
sequenceDiagram
    autonumber
    participant U as User (browser)
    participant Web as @repo/web<br/>app/catalog/page.tsx
    participant SDK as @repo/sdk<br/>createApiClient
    participant API as @repo/api<br/>AssetsController
    participant Svc as AssetsService
    participant DB as PostgreSQL<br/>(Prisma)

    U->>Web: GET /catalog
    Web->>SDK: listAssets({ page, limit })
    SDK->>API: GET /assets?page&limit
    API->>Svc: listPublished(page, limit)
    Svc->>DB: prisma.asset.findMany / count<br/>where status = PUBLISHED
    DB-->>Svc: rows + total
    Svc-->>API: PaginatedPublicAssetsDto
    API-->>SDK: 200 JSON
    SDK->>SDK: PaginatedPublicAssetsSchema.parse()
    SDK-->>Web: typed data
    Web-->>U: HTML (SSR)
```

---

## 6. Поток запроса: `/users/me` (Clerk)

Приватный эндпоинт: `ClerkAuthGuard` проверяет Bearer-JWT, в БД делается upsert пользователя.

```mermaid
sequenceDiagram
    autonumber
    participant U as User (browser)
    participant Web as @repo/web<br/>/account
    participant Clerk as Clerk
    participant API as @repo/api<br/>UsersController
    participant Guard as ClerkAuthGuard
    participant Svc as UsersService
    participant DB as PostgreSQL

    U->>Web: GET /account
    Web->>Clerk: session / JWT
    Clerk-->>Web: JWT
    Web->>API: GET /users/me<br/>Authorization: Bearer <jwt>
    API->>Guard: canActivate()
    Guard->>Clerk: verifyToken(jwt)
    Clerk-->>Guard: { sub, email, ... }
    Guard-->>API: req.clerkUserId
    API->>Svc: syncAndGetMe(clerkUserId)
    Svc->>DB: user.upsert by externalId
    DB-->>Svc: User row
    Svc-->>API: UserMeDto
    API-->>Web: 200 JSON
    Web-->>U: account page
```

---

## 7. Модель данных (Prisma ER)

`apps/api/prisma/schema.prisma` — 10 моделей домена маркетплейса: пользователи и продавцы, ассеты с файлами и тегами, покупки, выплаты, отзывы, избранное, журнал вебхуков.

```mermaid
erDiagram
    User ||--o| SellerAccount : becomes
    User ||--o{ Purchase : buys
    User ||--o{ Review : writes
    User ||--o{ Favorite : marks

    SellerAccount ||--o{ Asset : owns
    SellerAccount ||--o{ Payout : receives

    Asset ||--o{ AssetFile : has
    Asset ||--o{ AssetTag : tagged
    Tag   ||--o{ AssetTag : tagged
    Asset ||--o{ PurchaseItem : inOrder
    Asset ||--o{ Review : reviewed
    Asset ||--o{ Favorite : favorited

    Purchase ||--o{ PurchaseItem : contains

    User {
      string id PK
      string externalId "Clerk id"
      string email UK
      string role "USER|SELLER|ADMIN"
    }
    SellerAccount {
      string id PK
      string userId FK
      string stripeAccountId
      bool   onboarded
    }
    Asset {
      string id PK
      string sellerId FK
      string slug UK
      string status "DRAFT|SUBMITTED|PUBLISHED|REJECTED"
      int    priceCents
      string currency
    }
    AssetFile {
      string id PK
      string assetId FK
      string kind "MODEL|TEXTURE|DOCUMENT|PREVIEW"
      string s3Key
      int    sizeBytes
    }
    Tag {
      string id PK
      string name UK
      string slug UK
    }
    AssetTag {
      string assetId FK
      string tagId FK
    }
    Purchase {
      string id PK
      string buyerId FK
      string stripePaymentIntentId UK
      int    totalCents
    }
    PurchaseItem {
      string id PK
      string purchaseId FK
      string assetId FK
      string license "STANDARD|EXTENDED"
      int    unitPriceCents
    }
    Payout {
      string id PK
      string sellerId FK
      int    amountCents
      string status "INITIATED|PAID|FAILED"
    }
    Review {
      string id PK
      string assetId FK
      string userId FK
      int    rating
    }
    Favorite {
      string id PK
      string userId FK
      string assetId FK
    }
    WebhookEvent {
      string id PK
      string source "STRIPE|..."
      string eventType
      string payload
    }
```

---

## 8. Маршрутизация

Видимая наружу поверхность — маршруты веба и REST API.

```mermaid
flowchart LR
    subgraph WebRoutes["@repo/web — App Router"]
        W1["/"]
        W2["/catalog"]
        W3["/account<br/>(Clerk protected)"]
        W4["/sign-in/[[...sign-in]]"]
        W5["/sign-up/[[...sign-up]]"]
    end

    subgraph ApiRoutes["@repo/api — REST"]
        A1["GET /"]
        A2["GET /health.txt"]
        A3["GET /health"]
        A4["GET /assets<br/>?page&limit"]
        A5["GET /users/me<br/>Bearer JWT"]
        A6["GET /api/docs<br/>Swagger UI"]
    end

    W2 --> A4
    W3 --> A5
```

---

## Как обновлять диаграммы

- Любой GitHub-просмотрщик или VS Code с расширением Mermaid рендерит блоки выше.
- Если добавляешь новый модуль Nest — обнови §4; новую модель Prisma — §7; новый внешний сервис — §3.
- Прогресс по фичам по-прежнему ведётся в [docs/PROJECT_STATE.md](./PROJECT_STATE.md) (правило проекта — не плодить `*_STATUS.md` / `*_REPORT.md`).
