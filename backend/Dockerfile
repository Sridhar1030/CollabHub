FROM node:20-alpine AS deps

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts \
    && npm cache clean --force

# ---------------------------------------------------
FROM node:20-alpine

RUN apk add --no-cache dumb-init

ENV NODE_ENV=production
ENV PORT=5000
ENV MONGODB_URI=mongodb+srv://pavanrasal4:pavan164142@cluster0.83uq4.mongodb.net/collabhub

WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .

USER node

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost:5000/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
