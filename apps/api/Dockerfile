FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY turbo.json ./
COPY tsconfig.base.json ./

COPY apps/api/package.json ./apps/api/package.json
COPY packages/config/package.json ./packages/config/package.json

RUN pnpm install --no-frozen-lockfile

COPY apps/api ./apps/api
COPY packages/config ./packages/config

RUN pnpm --filter @akilli-alisveris/config build
RUN pnpm --filter @akilli-alisveris/api build

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "apps/api/dist/main.js"]