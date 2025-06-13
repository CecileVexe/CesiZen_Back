FROM node:22.12.0-alpine AS builder

LABEL org.opencontainers.image.source https://github.com/cecilevexe/cesizen_back

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY prisma ./prisma/

# Install app dependencies
RUN npm install

COPY . .

RUN npm run build

FROM node:22.12.0-alpine AS cesizen-backend

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD [ "npm", "run", "start:migrate:prod" ]

# ERREUR A CORRIGER
# node:internal/modules/cjs/loader:1252
# backend-1   |   throw err;
# backend-1   |   ^
# backend-1   | 
# backend-1   | Error: Cannot find module '/dist/main'
# backend-1   |     at Function._resolveFilename (node:internal/modules/cjs/loader:1249:15)
# backend-1   |     at Function._load (node:internal/modules/cjs/loader:1075:27)
# backend-1   |     at TracingChannel.traceSync (node:diagnostics_channel:322:14)
# backend-1   |     at wrapModuleLoad (node:internal/modules/cjs/loader:219:24)
# backend-1   |     at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:170:5)
# backend-1   |     at node:internal/main/run_main_module:36:49 {
# backend-1   |   code: 'MODULE_NOT_FOUND',
# backend-1   |   requireStack: []
# backend-1   | }


# # Use Node.js 20.11.1 base image
# FROM node:22.12.0-alpine as cesizen-backend

# # Set working directory
# WORKDIR /app

# # Copy package.json and package-lock.json
# COPY package*.json ./
# COPY prisma ./prisma/

# # Install dependencies
# RUN npm cache clean --force
# RUN npm install --legacy-peer-deps

# # Copy the rest of the application code
# COPY . .

# # Generate Prisma Client code
# RUN npx prisma generate

# # Expose the port the app runs on, here, I was using port 3333
# EXPOSE 3000

# # Command to run the app
# CMD [  "npm", "run", "start:migrate:prod" ]