# Stage 1: Install dependencies and generate Prisma client
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package descriptors and prisma schema 
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Install dependencies including devDependencies (needed to run prisma generate & next build compilation)
RUN npm ci

# Stage 2: Build the application
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for the build phase
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
ENV DATABASE_URL "file:/app/prisma/dev.db"

# Generate prisma client before building
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# Stage 3: Runner stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set up data storage for SQLite and grant ownership to the non-root user
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data

# Copy public assets and standalone build output from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# server.js is created automatically by next build standalone
CMD ["node", "server.js"]
