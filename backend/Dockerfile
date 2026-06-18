FROM node:20-alpine AS builder
WORKDIR /app
# package-lock.json is generated with npm 11; node:20 ships npm 10
RUN npm install -g npm@11.17.0
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
RUN npm install -g npm@11.17.0

COPY package*.json prisma.config.ts ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY prisma ./prisma/

RUN mkdir -p uploads

EXPOSE 5050
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]
