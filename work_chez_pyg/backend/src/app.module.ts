/*  Lib modules */
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

/*  Src/modules */
import { UsersModule } from './users/users.module';
import { MatchHistoryModule } from './match-history/match-history.module';
import { FriendsModule } from './friends/friends.module';
// import { channelPasswordEncryptionMiddleware, userPasswordEncryptionMiddleware } from './middleware/pwEncryption.middleware';
import { DirectMessageModule } from './direct-message/direct-message.module';

/*  Gateway */

/*  Middleware */

@Module({
  imports: [TypeOrmModule.forRoot(),
        UsersModule,
        MatchHistoryModule,
        FriendsModule,
        DirectMessageModule],
  providers: [],
})
export class AppModule {
  // async configure(consumer: MiddlewareConsumer) {
  //   await consumer.apply(userPasswordEncryptionMiddleware).forRoutes('/users');
  // }
}
