FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json prisma.config.ts ./
COPY prisma ./prisma/
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
RUN npx tsc prisma/seed.ts --outDir dist/prisma --esModuleInterop --skipLibCheck --module commonjs --target ES2021 --moduleResolution node

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache wget

COPY package*.json prisma.config.ts ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY prisma ./prisma/
COPY docker-entrypoint.sh ./docker-entrypoint.sh

RUN mkdir -p uploads && chmod +x docker-entrypoint.sh

EXPOSE 5050
ENTRYPOINT ["./docker-entrypoint.sh"]
