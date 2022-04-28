import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/* This class is a guard that uses the local strategy to authenticate a user. */
@Injectable()
export class LocalAuthenticationGuard extends AuthGuard('local') {}
