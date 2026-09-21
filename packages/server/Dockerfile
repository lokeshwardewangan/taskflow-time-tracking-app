FROM oven/bun:1-alpine

WORKDIR /app

COPY package.json bun.lock ./
COPY packages/server/package.json ./packages/server/package.json
COPY packages/client/package.json ./packages/client/package.json

RUN bun install --frozen-lockfile --ignore-scripts

COPY packages/server ./packages/server

WORKDIR /app/packages/server
RUN bunx --bun prisma generate --config prisma7.config.ts \
    && bun build ./src/index.ts --outdir ./dist --target bun --packages external

EXPOSE 5000

CMD ["bun", "run", "start"]
