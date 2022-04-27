import { Module } from '@nestjs/common';
import { PostsModule } from './post/posts.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PostsModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
        // JWT_SECRET: Joi.string().required(),
        // JWT_EXPIRATION_TIME: Joi.string().required(),
      })
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [AuthService],
})
export class AppModule {}
