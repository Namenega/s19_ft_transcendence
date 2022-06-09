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
