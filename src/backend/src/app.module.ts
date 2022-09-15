/*  Lib modules */
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

/*  Src/modules */
import { UsersModule } from './users/users.module';
import { MatchHistoryModule } from './match-history/match-history.module';
import { FriendsModule } from './friends/friends.module';
import { DirectMessageModule } from './direct-message/direct-message.module';
import { ChannelsModule } from './channels/channels.module';
import { GamesModule } from './games/games.module';

/*  Gateway */
import { ChatGateway } from './gateways/chat/chat.gateway';
import { GameGateway } from './gateways/game/game.gateway';
import { APP_INTERCEPTOR } from '@nestjs/core';

/*  Middleware */
import { channelPasswordEncryptionMiddleware, userPasswordEncryptionMiddleware } from './middleware/pwEncryption.middleware';

/*  Interceptor */
import { setUserStatusInterceptor } from './interceptors/userStatus.interceptor';

@Module({
  imports: [TypeOrmModule.forRoot({
    "type": "postgres",
    "host": "postgres",
    "port": 5432,
    "username": process.env.username,
    "password": process.env.password,
    "database": process.env.database,
    "entities": ["dist/**/*.entity{ .ts,.js}"],
    "synchronize": true
  }),
        UsersModule,
        ChannelsModule,
        MatchHistoryModule,
        FriendsModule,
        DirectMessageModule,
        GamesModule],
  providers: [ChatGateway, GameGateway, { provide: APP_INTERCEPTOR, useClass: setUserStatusInterceptor}],
})
export class AppModule {
    async configure(consumer: MiddlewareConsumer) {
        consumer.apply(channelPasswordEncryptionMiddleware).forRoutes('/channels');
        consumer.apply(userPasswordEncryptionMiddleware).forRoutes('/users');
    }
}
