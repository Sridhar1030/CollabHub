FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies (use package.json only to leverage build cache)
COPY package*.json ./

# Prefer npm ci when lockfile present; fall back to npm install
RUN if [ -f package-lock.json ]; then \
      npm ci --only=production --silent; \
    else \
      npm install --only=production --silent; \
    fi

# Copy application source
COPY . .

# Use non-root user for security
RUN chown -R node:node /usr/src/app
USER node

# Default environment
ENV NODE_ENV=production
ENV PORT=5000

# Expose application port
EXPOSE 5000

# Start the server
CMD ["node","server.js"]
