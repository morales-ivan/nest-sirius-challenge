<div align='center'>
    <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" alt="NodeJS">
    <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS">
    <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma">
    <img src="https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white" alt="Swagger">
    <img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
    <img src="https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint">
</div>

## Description

Nest training project using Prisma ORM and Postgres, with a containerized developer experience.

## Running the app

### Docker

Ensuring you have Docker installed, run the following command to get the app up and running:

```bash
$ yarn docker:start:local:fresh
```

That will spin up a fresh DB instance and start the app in watch mode, rebuilding with changes made locally.

In case you have a sql dump of the database, you can name it `init.sql` and place it under the `/config/db/restore` folder.
Next, run this command to spin up the app and the DB with the dump data:

```bash
$ yarn docker:start:local:load
```

In case you already had a DB instance set up, you can run this command to wipe out the volumes in Docker:

```bash
$ yarn docker:clean:volumes
```

Firing already exiting containers (resuming the app) can be done so with:

```bash
$ yarn docker:start:local
# this will not initialize the db, only use this when it's already set up
```

When making changes to the package.json, like adding a script or a dependency, you will need to rebuild the base layer of the image. Stop the containers and run this command:
    
```bash
$ yarn docker:start:local:rebuild
# just like the last command, this will not initialize the db
```

### Local

You may want to run the app locally (to attach a debugger for instance), and for that a Postgres server is required. The easiest way to get one is to use Docker.
Run the following commands in order to get everything set up and running:

```bash
# installs the dependencies locally
$ yarn install

# spins up a Postgres instance in a Docker container
$ yarn docker:db:dev:up

# runs the app locally in watch mode
$ yarn start:local
```

## Test

### E2E Tests

```bash
# spinning up a blank test db
$ yarn docker:db:test:restart

# running the e2e tests
$ yarn test:e2e
```

## Additional commands

```bash
# WARNING: this will prune all data from Docker, including others projects'
$ yarn docker:clean

# building the Docker image
$ yarn docker:image:build
```
