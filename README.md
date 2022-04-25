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
- Launch : docker-compose up --build

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
