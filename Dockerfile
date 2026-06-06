# Stage 1: Install dependencies and generate Prisma client
FROM node:20-slim AS deps
RUN apt-get update && apt-get install -y openssl ca-certificates
WORKDIR /app

# Copy package descriptors and prisma schema 
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Install dependencies including devDependencies (needed to run prisma generate & next build compilation)
RUN npm ci

# Stage 2: Build the application
FROM node:20-slim AS builder
RUN apt-get update && apt-get install -y openssl ca-certificates
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Ensure public directory exists to avoid build failure if empty
RUN mkdir -p public

# Set environment variables for the build phase
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
ENV DATABASE_URL "postgresql://postgres:postgres@localhost:5432/bizsearch?schema=public"

# Generate prisma client before building
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# Stage 3: Runner stage
FROM node:20-slim AS runner
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create a non-root group and user
RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 nextjs

# Set up data storage for SQLite and grant ownership to the non-root user
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data

# Copy public assets and standalone build output from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/seedPrisma.js ./seedPrisma.js
COPY --from=builder --chown=nextjs:nodejs /app/data ./data
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.bin ./node_modules/.bin

# Create global system symlinks and set the appropriate execution permissions for all Prisma CLI options
RUN chmod +x /app/node_modules/prisma/build/index.js && \
    chmod +x /app/node_modules/.bin/prisma && \
    ln -sf /app/node_modules/prisma/build/index.js /usr/local/bin/prisma && \
    ln -sf /app/node_modules/prisma/build/index.js /usr/bin/prisma

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# server.js is created automatically by next build standalone
CMD ["node", "server.js"]
