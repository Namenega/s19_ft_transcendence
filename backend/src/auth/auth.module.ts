import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';


@Module({
	imports: [UsersModule, PassportModule],
	providers: [AuthService, LocalStrategy],
	exports:[AuthController],
	controllers: [AuthController]
})
export class AuthModule {}