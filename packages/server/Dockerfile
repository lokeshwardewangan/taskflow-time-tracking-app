FROM oven/bun:1-alpine

WORKDIR /app

COPY package.json bun.lock ./
COPY packages/server/package.json ./packages/server/package.json
COPY packages/client/package.json ./packages/client/package.json

RUN bun install --frozen-lockfile --ignore-scripts

COPY packages/server ./packages/server

WORKDIR /app/packages/server
# Optional build-time check: an empty migration folder previously caused Prisma
# error P3015 and stopped the server from starting. Catch missing SQL files early.
# This does not run migrations; Docker Compose runs `prisma migrate deploy` at startup.
RUN for migration in prisma/migrations/*/; do \
      [ -f "${migration}migration.sql" ] || { echo "Missing ${migration}migration.sql"; exit 1; }; \
    done
RUN bunx --bun prisma generate --config prisma7.config.ts \
    && bun build ./src/index.ts --outdir ./dist --target bun --packages external

EXPOSE 5000

CMD ["bun", "run", "start"]
