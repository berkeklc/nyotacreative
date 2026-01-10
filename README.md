# Nyota Ecosystem

A monorepo containing the Nyota platform ecosystem:

- **Nyota Creative** (`apps/creative`) - Premium creative & software agency
- **Nyota Travel** (`apps/travel`) - Tanzania & Zanzibar travel content platform
- **Strapi CMS** (`apps/cms`) - Headless CMS content schemas

## Architecture

```
nyota-ecosystem/
├── apps/
│   ├── creative/      # Agency site (Next.js 16)
│   ├── travel/        # Travel platform (Next.js 16)
│   └── cms/           # Strapi 5 content types
├── packages/
│   ├── ui/            # Shared UI components
│   ├── eslint-config/ # ESLint configuration
│   └── typescript-config/
└── turbo.json
```

## Requirements

- **Node.js 20+** (required for Next.js 16 and Strapi 5)
- npm 10+

## Getting Started

```bash
# Install dependencies
npm install

# Run development servers
npm run dev

# Build all apps
npm run build
```

## Apps

### Nyota Creative (Port 3000)
Premium agency site with minimalist design, charcoal/gold color palette.

### Nyota Travel (Port 3001)
Travel content platform with warm ocean/sunset colors, tour booking cards.

## Domain Strategy

- `nyota.com` → Nyota Creative (agency)
- `travel.nyota.com` → Nyota Travel (content platform)

## CMS Setup

Strapi 5 content types are pre-configured. To initialize Strapi:

```bash
# Requires Node.js 20+
cd apps/cms
npx create-strapi@latest . --skip-cloud --no-run
```

Then copy the content type schemas from `src/api/` to the new Strapi project.

## Tech Stack

- **Frontend:** Next.js 16 (App Router)
- **Styling:** CSS Modules + Design Tokens
- **CMS:** Strapi 5 (schemas ready)
- **Monorepo:** Turborepo
- **Languages:** English + Swahili (i18n ready)
