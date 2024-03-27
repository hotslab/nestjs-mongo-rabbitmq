# NESTJS, MONGODB & RABBITMQ API



## Description

#### [Nest](https://github.com/nestjs/nest) framework TypeScript API project. It is built with the following technologies:

1. Nestjs
2. Docker and Docker-compose - (optional)
3. MongoDB
4. RabbitMq

## Installation

- Clone or unpack the folder to folder of your choice i.e.
```bash
$ git clone git@github.com:hotslab/nestjs-mongo-rabbitmq.git
# OR
$ unzip nestjs-mongo-rabbitmq-master.zip
```
- Go in to the cloned or unzipped folder
```bash
$ cd nestjs-mongo-rabbitmq-master
# OR 
$ cd nestjs-mongo-rabbitmq
```
- Create an `.env` file to use for the application from the `env.example` file:
```bash
$ cp .env.example .env
```
- Ensure you have installed docker and docker-compose installed if you do not have locally installed instances of **mongodb** and **rabbitmq**, or if you want to use separate instances from your local ones.
- If you want to use docker versions whilst separating the local instances, please do ensure the **ports** numbers do not clash by changing the `docker yml` file port numbers as well as the `.env` file for the mongodb and rabbitmq port numbers.
- To run the docker versions please run the following commands:
```bash
# create the persistent storage volumes for both mongodb and rabbitmq
$ mkdir mongodb rabbitmq

# build the docker containers
$ docker-compose build

# start the docker services
$ docker-compose up
```
- Lastly install the `node_modules` to run the app:
```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run build
$ npm run start:prod
```

## Test

```bash
# eslint
$ npm run lint

# unit tests
$ npm run test
```

## API

#### 1. POST api/users
##### Content-Type 
- multipart/form-data
##### parameters :
- **firstName** - string
- **lastName** - string
- **email** -string
- **password** - string
- **avatar** - avatar image to upload - `jpg|jpeg|png|webp`

#### 2. GET api/users/{userId}
##### Content-Type 
-  application/json
##### parameters :
- **userId** - MongoDb ObjectId() in string format



#### 3. GET api/users/{userId}/avatar
##### Content-Type 
-  application/json
##### parameters :
- **userId** - MongoDb ObjectId() in string format


#### 4. DELETE api/users/{userId}/avatar
##### Content-Type 
-  application/json
##### parameters :
- **userId** - MongoDb ObjectId() in string format
