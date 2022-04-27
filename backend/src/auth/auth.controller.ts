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

	/* A POST request to the /auth/register endpoint. It takes the body of the request
	and passes it to the register function in the authService. */
	@Post('register')
	async register(@Body() registrationData: RegisterDto) {
		return this.authService.register(registrationData);
	}

	/* A login route that uses the LocalAuthenticationGuard to authenticate the user. */
	@HttpCode(200) // POST responds 201 so we change it
	@UseGuards(LocalAuthenticationGuard)
	@Post('log-in')
	async logIn(@Req() request: RequestWithUser) {
		const user = request.user;
		user.password = undefined;
		return user;
	}
}
