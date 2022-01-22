# Stage 1 - Build
FROM node:16 as builder
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm config set unsafe-perm true
RUN npm install
COPY . .
RUN npm run build

# Stage 2 - App
FROM node:lts-alpine3.14

# Install git so that can npm install package from git repo
# RUN apk add git

# dumb-init is used to properly handle events (SIGHUP etc) to safely terminate a Node.js Docker web application
# RUN apk add dumb-init

# Environment production
ENV NODE_ENV production

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/package-lock.json ./
COPY --from=builder /usr/src/app/db.json ./


RUN npm config set unsafe-perm true
RUN npm ci --only=production
# RUN npm install

EXPOSE 4000

USER node

CMD ["node", "dist/index.js" ]
