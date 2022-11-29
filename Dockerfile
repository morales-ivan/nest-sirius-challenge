FROM node:18.8-slim AS base

WORKDIR /usr/src/nest-challenge

COPY package.json .
COPY yarn.lock .

RUN yarn install --production=false

COPY . .

FROM node:18.8-slim AS build

WORKDIR /usr/src/nest-challenge

COPY --from=base /usr/src/nest-challenge .

RUN yarn run build:app

FROM node:18.8-slim AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/nest-challenge/app

COPY package.json .
COPY yarn.lock .

RUN yarn install --production

#COPY . .
COPY --from=build /usr/src/nest-challenge/dist ./dist

CMD ["yarn", "run", "docker:start:prod"]
