# Stage 1: Dependencies
FROM node:25-bookworm-slim AS deps

WORKDIR /app

# Install native build dependencies needed during npm install
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Install OpenSSL 1.1 compatibility libraries required by the current Prisma setup
RUN echo 'deb http://deb.debian.org/debian bullseye main' >> /etc/apt/sources.list && \
    apt-get update && apt-get install -y --no-install-recommends libssl1.1 && \
    rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Builder
FROM node:25-bookworm-slim AS builder

WORKDIR /app

# Install OpenSSL 1.1 compatibility libraries required by the current Prisma setup
RUN echo 'deb http://deb.debian.org/debian bullseye main' >> /etc/apt/sources.list && \
    apt-get update && apt-get install -y --no-install-recommends \
    libssl1.1 \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Generate UI style layout
RUN npm run generate:ui-style-layout

# Copy phaser assets to public (before build so they're available at runtime)
RUN rm -rf /app/public/assets && cp -r /app/phaser/assets /app/public/

# Build the application (with dummy API key to pass build-time validation)
ENV OPENAI_API_KEY=sk-dummy
RUN npm run build

# Stage 3: Production runner
FROM node:25-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install runtime libraries required by the current Prisma setup
RUN echo 'deb http://deb.debian.org/debian bullseye main' >> /etc/apt/sources.list && \
    apt-get update && apt-get install -y --no-install-recommends \
    libssl1.1 \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Copy necessary files from builder
COPY --from=builder /app/.next/standalone ./.next/standalone
COPY --from=builder /app/.next/static ./.next/standalone/.next/static
# Copy public folder to standalone directory for static asset serving
COPY --from=builder /app/public ./.next/standalone/public
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", ".next/standalone/server.js"]
