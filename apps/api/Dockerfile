FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json ./

COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY packages/config/package.json ./packages/config/package.json
COPY packages/db/package.json ./packages/db/package.json
COPY packages/extraction/package.json ./packages/extraction/package.json
COPY packages/ingestion/package.json ./packages/ingestion/package.json
COPY packages/source/package.json ./packages/source/package.json
COPY packages/storage/package.json ./packages/storage/package.json

RUN pnpm install --no-frozen-lockfile

COPY apps ./apps
COPY packages ./packages
COPY config ./config
COPY schemas ./schemas

RUN pnpm --filter @akilli-alisveris/api... run build

ENV NODE_ENV=production
ENV API_HOST=0.0.0.0
ENV API_PORT=3100

EXPOSE 3100

CMD ["node", "apps/api/dist/main.js"]
