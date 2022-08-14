# BUILD FOR DEVELOPMENT
FROM node:16-alpine as development

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

USER node

# BUILD FOR PRODUCTION
FROM node:16-alpine as build

WORKDIR /app

COPY package*.json ./
COPY --from=development /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV production

RUN npm run build && npm ci --only=production && npm cache clean --force

USER node

# RUN PRODUCTION
FROM node:16-alpine as production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./

EXPOSE 4000

ENTRYPOINT [ "npm", "run" ]

CMD [ "start:prod" ]