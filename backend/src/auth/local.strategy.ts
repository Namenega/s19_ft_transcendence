import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { AuthService } from "./auth.service";
import User from "src/users/entity/user.entity";

/* "The LocalStrategy class extends the PassportStrategy class and overrides the
validate method." */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private authService: AuthService) {
		super({
			usernameField: 'email'
		}
		);
	}

	/**
	 * It returns a promise that resolves to a user object
	 * @param {string} email - The email address of the user.
	 * @param {string} password - The password that the user entered in the login
	 * form.
	 * @returns A user object
	 */
	async validate(email: string, password: string): Promise<User> {
		return this.authService.getAuthenticatedUser(email, password);
	}
}
