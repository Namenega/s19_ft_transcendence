# S19 - FT_TRANSCENDENCE

<p align="center">
  <img src="https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white">
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white">
  <img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white">
</p>

This project is the final common core project of [19](http://www.s19.be/) (42 network).

<h1 align="center">Overview</h1>

Singe Page Application website where users are able to play the Pong game.


<!-- <h1 align="center">Technologies</h1> -->

- Back end : __NestJS__
- Front end : any __TS framework__ of our choice
- Free to use any lib@latest
- DB : __PostgreSQL__
- Have to run on latest version of _Chrome_, _Firefox_ & _Safari_
- Launch : ***docker-compose up --build***

<h1 align="center">TODO</h1>

#### Security
- [ ] Password stored in db must be encrypted
- [ ] Website must be protected against SQLi
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

<h1 align="center">Docs</h1>

### Install
<details>
<summary>"Click"</summary>

```
### install Node JS ###
>$ sudo apt install nodejs

### install NPM ###
>$ sudo apt install npm

### install NestJS ###
>$ npm i -g @nestjs/cli

### create new NestJS Project ###
>$ nest new <project_name>

### run NestJS project ###
>$ npm run start
>$ npm run start:dev	//watch mode : recommended

### install NestJS Config ### [NO NEED]
>$ npm i --save @nestjs/config

### install TypeOrm ###
>$ npm i --save @nestjs/typeorm typeorm

--------------------------------

### create Module ###
>$ nest g module <module_name>

### create Controller ###
>$ nest g controller <controller_name>

### create Service ###
>$ nest g service <service_name>

### install built-ins ValidationPipe ###
>$ npm i --save class-validator class-transformer

### install bcrypt for password hashing ###
>$ npm install @types/bcrypt bcrypt

### install passport for abstraction over authentication ###
>$ npm install @nestjs/passport passport @types/passport-local passport-local @types/express

### install JWT(JSON Web Tokens) ### [NO NEED]
>$ npm install @nestjs/jwt passport-jwt @types/passport-jwt cookie-parser @types/cookie-parser

### install Mapped-Types
>$ npm i --save @nestjs/mapped-types

### install RxJS
>$ npm install rxjs

### install express
>$ npm install express --save

### install speakeasy
>$ npm install --save speakeasy

### install lodash
>$ npm i lodash

### install timers
>$ npm i timers

### install nestjs/websockets
>$ npm i @nestjs/websockets

### install socket.io
>$ npm i socket.io

### install plateform-socket.io
>$ npm install @nestjs/platform-socket.io

### install socket io client
npm i socket.io-client
```
- [Install Docker](https://docs.docker.com/engine/install/ubuntu/)
- [Install Docker compose](https://docs.docker.com/compose/install/)

</details>

### Full Tuto
<details>
<summary>"Click"</summary>

- [Learn NestJs ytb](https://www.youtube.com/watch?v=GHTA143_b-s&t=3537s)
- [API with NestJS](https://wanago.io/2020/05/11/nestjs-api-controllers-routing-module/)
- [Full-stack app w/ Nest & React](https://blog.logrocket.com/full-stack-app-tutorial-nestjs-react/)

</details>

### Javascript & Typescript/React Theory
<details>
<summary>"Click"</summary>

***Advanced JS***
- [Arrow functions](https://www.javascripttutorial.net/es6/javascript-arrow-function/)
- [ASync / Await functions](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/async_function)
- [Promises](https://www.geeksforgeeks.org/javascript-promises/)

***Typescript***
- [Typescript tuto](https://www.typescripttutorial.net/)

***React JS***
- [Typescript & React tuto video](https://www.youtube.com/watch?v=FJDVKeh7RJI)
- [Create React App](https://create-react-app.dev/docs/getting-started/)
- [React Tab](https://react.semantic-ui.com/modules/tab/#types-basic)
- [State & Lifecycle](https://reactjs.org/docs/state-and-lifecycle.html)
- [Hook Lib](https://reactjs.org/docs/hooks-intro.html)

</details>


### Nest Theory
<details>
<summary>"Click"</summary>

<p align="center">
<a href="https://javascript.plainenglish.io/nestjs-roadmap-for-beginners-4fee5be251b">Learn NestJS</a>
<!-- - [Learn NestJS](https://javascript.plainenglish.io/nestjs-roadmap-for-beginners-4fee5be251b) -->
</p>

<p align="center">
  <img width="460" height="300" src="https://github.com/Namenega/s19_ft_transcendence/blob/main/random/NestJS_roadmap.png">
</p>

<p align="center">
How NestJS concepts work?
</p>

<p align="center">
  <img src="https://github.com/Namenega/s19_ft_transcendence/blob/main/random/map_nest.png">
</p>

[Project Linked Graph](https://github.com/Namenega/s19_ft_transcendence/blob/main/random/Roadmap_transcendence.pdf)


***Concepts***
- [Overview by Creator](https://www.youtube.com/watch?v=f0qzBkAQ3mk)
- [NestJS For Beginner](https://tkssharma.com/Learning-nestjs-as-beginner-developer/)
- [Nest Module](https://docs.nestjs.com/modules)
- [Angular Module (complementary Module theory)](https://angular-training-guide.rangle.io/modules/introduction)
- [Nest Controller](https://docs.nestjs.com/controllers)
- [Angular Routes (complementary Controller theory)](https://angular-training-guide.rangle.io/routing)
- [Nest Service](https://docs.nestjs.com/providers)
- [Nest Guards](https://docs.nestjs.com/guards)
- [Nest Decorator](https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841)

***Config***
- [Config - .env - .forRoot()](https://docs.nestjs.com/techniques/configuration)
- [.env file](https://malware.expert/general/what-is-env-files/)

***Requests***
- [HTTP Requests](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html)

***Security***
- [LIB : TypeOrm Entity](https://typeorm.io/entities)
- [ORM](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping)
- [LIB : JSON Web Token](https://jwt.io/introduction)
- [LIB : SpeakEasy](https://github.com/speakeasyjs/speakeasy)
- [LIB : Bcrypt](https://heynode.com/blog/2020-04/salt-and-hash-passwords-bcrypt/)

***DTO***
- [DTO](https://javascript.plainenglish.io/use-of-dto-for-validation-in-nestjs-application-d37ff55f0560)

***Validation***
- [Validation](https://docs.nestjs.com/techniques/validation)

***Authentication***
- [Authentication](https://docs.nestjs.com/security/authentication)
- [Authentication Sample](https://github.com/nestjs/nest/tree/master/sample/19-auth-jwt)

***Chat***
- [Chat](https://gabrieltanner.org/blog/nestjs-realtime-chat)

</details>

### Docker Compose Theory
<details>
<summary>"Click"</summary>

- [File reference](https://docs.docker.com/compose/compose-file/)

</details>


### Ressources
<details>
<summary>"Click"</summary>

- [42API](https://api.intra.42.fr/apidoc)
- [42API Tuto](https://api.intra.42.fr/apidoc/guides/web_application_flow)
- [Full-Stack Step-by-step](https://moustafamm.medium.com/how-to-plan-step-by-step-a-full-stack-application-ee4e842d55f2)
- [Full-Stack approach](https://dzone.com/articles/get-better-result-full-stack-project)


</details>
