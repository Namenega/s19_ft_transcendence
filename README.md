# s19_ft_transcendence

This project is the final common core project of [19](http://www.s19.be/) (42 network).

## Overview

SPA website where users are able to play the Pong game.

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

## Technologies

- Back end : __NestJS__

#### NestJS Roadmap

![alt text](https://github.com/Namenega/s19_ft_transcendence/blob/main/random/NestJS_roadmap.png "Nest roadmap")

- Front end : any __TS framework__ of our choice
- Free to use any lib@latest
- DB : __PostgreSQL__
- Have to run on latest version of _Chrome_, _Firefox_ & _Safari_
- Launch : ***docker-compose up --build***

## TODO:

#### Security
- [ ] password stored in db must be encrypted
- [ ] website must be protected against SQLi
- [ ] Implements a form/request validation on server side

#### User Account
- [ ] 42Intra OAuth log
- [ ] Unique username (printed on website)
- [ ] Downloaded or Default avatar
- [ ] 2FA with Google Auth/SMS
- [ ] User can add friend 
- [ ] Friends online status (online/offline/ingame/...)
- [ ] Stats : win/lose, rankings, levels, achievements on user interface
- [ ] Public Match History

#### Chat
- [ ] User can create channels (public/private/ password protected)
- [ ] User is automatically owner of the created channel until he leaves
- [ ] User is able to create/modify/delete a password for the channel
- [ ] User is admin of the channel and is able to give this right to other users
- [ ] Channel admins are able to ban/mute other users within a determined period
- [ ] User can send DM to other users
- [ ] User is abe to block others and their messages
- [ ] Through chat interface, user is able to invite others to start a game
- [ ] Through chat interface, user is able to access other profiles

#### Game
- [ ] User is able to start a live game with other users
- [ ] Match making system, waiting queue
- [ ] Close to Pong 1972
- [ ] Custom options but default version available
- [ ] Responsivity
- [ ] User is able to live watch other playing users

#### Ideas / Features
- [ ] Ban word list?

## Docs

#### Install

```
# install Node JS
>$ sudo apt install nodejs

# install NPM
>$ sudo apt install npm

# install NestJS
>$ npm i -g @nestjs/cli

# create new NestJS Project
>$ nest new <project_name>

# run NestJS project
>$ npm run start
>$ npm run start:dev	//watch mode : recommended

# install NestJS Config
>$ npm i --save @nestjs/config

# install TypeOrm
>$ npm i --save @nestjs/typeorm typeorm

--------------------------------

# create Module
>$ nest g module <module_name>

# create Controller
>$ nest g controller <controller_name>

# create Service
>$ nest g service <service_name>

# install built-ins ValidationPipe
>$ npm i --save class-validator class-transformer

# install bcrypt for password hashing
>$ npm install @types/bcrypt bcrypt

# install passport for abstraction over authentication
>$ npm install @nestjs/passport passport @types/passport-local passport-local @types/express

# install JWT(JSON Web Tokens)
npm install @nestjs/jwt passport-jwt @types/passport-jwt cookie-parser @types/cookie-parser
```
- [Install Docker](https://docs.docker.com/engine/install/ubuntu/)
- [Install Docker compose](https://docs.docker.com/compose/install/)


#### Full Tuto
- [Learn NestJs ytb](https://www.youtube.com/watch?v=GHTA143_b-s&t=3537s)
- [API with NestJS](https://wanago.io/2020/05/11/nestjs-api-controllers-routing-module/)


#### Javascript Theory
- [Arrow functions](https://www.javascripttutorial.net/es6/javascript-arrow-function/)
- [ASync / Await functions](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/async_function)
- [Promises](https://www.geeksforgeeks.org/javascript-promises/)

#### Nest Theory
- [Nest Module](https://docs.nestjs.com/modules)
- [Nest Controller](https://docs.nestjs.com/controllers)
- [Nest Service](https://docs.nestjs.com/providers)
- [Nest Guards](https://docs.nestjs.com/guards)

- [Config - .env - .forRoot()](https://docs.nestjs.com/techniques/configuration)

- [.env file](https://malware.expert/general/what-is-env-files/)

- [Decorator](https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841)
- [HTTP Requests](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html)

- [TypeOrm Entity](https://typeorm.io/entities)
- [ORM](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping)
- [JSON Web Token](https://jwt.io/introduction)

- [DTO](https://javascript.plainenglish.io/use-of-dto-for-validation-in-nestjs-application-d37ff55f0560)
- [Validation](https://docs.nestjs.com/techniques/validation)

- [Authentication](https://docs.nestjs.com/security/authentication)
- [Authentication Sample](https://github.com/nestjs/nest/tree/master/sample/19-auth-jwt)


#### Docker Compose Theory
- [File reference](https://docs.docker.com/compose/compose-file/)


#### 42 API docs
- [42API](https://api.intra.42.fr/apidoc)
