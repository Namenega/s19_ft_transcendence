import { Body, Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import RegisterDto from './dto/register.dto';
import RequestWithUser from './requestWithUser.interface';
import { LocalAuthenticationGuard } from './localAuth.guard';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService
	) {}

	@Post('register')
	async register(@Body() registrationData: RegisterDto) {
		return this.authService.register(registrationData);
	}

	@HttpCode(200) // POST responds 201 so we change it
	@UseGuards(LocalAuthenticationGuard)
	@Post('log-in')
	async logIn(@Req() request: RequestWithUser) {
		const user = request.user;
		user.password = undefined;
		return user;
	}
}
