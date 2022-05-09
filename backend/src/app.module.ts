import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'root',
    //   password: null,
    //   database: 'the_local_db',
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
