FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN mkdir -p public
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_SUPABASE_URL=https://jzhmytlbhlftmulwtqwv.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6aG15dGxiaGxmdG11bHd0cXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MDM0MTgsImV4cCI6MjA5ODI3OTQxOH0.7Bci_R7kgmRKhskvhIQM6V362nv2HB4x6QHxCRwd1YE
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"
ENV NEXT_PUBLIC_SUPABASE_URL=https://jzhmytlbhlftmulwtqwv.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6aG15dGxiaGxmdG11bHd0cXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MDM0MTgsImV4cCI6MjA5ODI3OTQxOH0.7Bci_R7kgmRKhskvhIQM6V362nv2HB4x6QHxCRwd1YE
ENV SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6aG15dGxiaGxmdG11bHd0cXd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjcwMzQxOCwiZXhwIjoyMDk4Mjc5NDE4fQ.lNULi3Y4lAcNu9kA3JpLuboyGCs-Q1O17mH_Kc-jsMk

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone build (contains server.js, node_modules, package.json, .next/server)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Copy static files
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy public assets
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy data directory (if it exists)
COPY --from=builder --chown=nextjs:nodejs /app/data ./data

USER nextjs

EXPOSE 3001

CMD ["node", "server.js"]
