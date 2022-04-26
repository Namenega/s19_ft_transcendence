# s19_ft_transcendence

This project is the final common core project of [19](http://www.s19.be/) (42 network).

## Overview

SPA website where users are able to play the Pong game.

## Technologies

- Back end : __NestJS__
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
#install Node JS
sudo apt install nodejs

#install NPM
sudo apt install npm

#install NestJS
npm i -g @nestjs/cli

#create new NestJS Project
nest new <project_name>

#run NestJS project
npm run start
npm run start:dev	//watch mode : recommended

#install NestJS Config
npm i --save @nestjs/config

#install TypeOrm
npm i --save @nestjs/typeorm typeorm
```
[Install Docker](https://docs.docker.com/engine/install/ubuntu/)
[Install Docker compose](https://docs.docker.com/compose/install/)


#### Full Tuto
[Learn NestJs ytb](https://www.youtube.com/watch?v=GHTA143_b-s&t=3537s)
[API with NestJS](https://wanago.io/2020/05/11/nestjs-api-controllers-routing-module/)

#### Nest Theory
[Nest Module](https://docs.nestjs.com/modules)
[Nest Controller](https://docs.nestjs.com/controllers)
[Nest Service](https://docs.nestjs.com/providers)

[Config - .env - .forRoot()](https://docs.nestjs.com/techniques/configuration)
[.env file](https://malware.expert/general/what-is-env-files/)

[Decorator](https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841)

[TypeOrm Entity](https://typeorm.io/entities)


#### Docker Compose Theory
[File reference](https://docs.docker.com/compose/compose-file/)
