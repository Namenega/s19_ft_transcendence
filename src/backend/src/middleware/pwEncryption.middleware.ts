import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

const bcrypt = require('bcrypt');

//Cleaner method would be to encrypt a password in appropriate entity @BeforeInsert function...

/* It checks if the request is a POST or PUT request, if the request body has a
type property with value password and if the password property is less than 20
characters long. If all these conditions are true, then it encrypts the password
and replaces the password property in the request body with the encrypted
password */
@Injectable()
export class channelPasswordEncryptionMiddleware implements NestMiddleware {
  /**
   * If the request method is not GET or DELETE and the request body has a type
   * property with value password and a password property with value less than 20,
   * then encrypt the password and replace the password property with the encrypted
   * password
   * @param {Request} req - Request - The request object
   * @param {Response} res - Response - The response object
   * @param {NextFunction} next - The next middleware function in the stack.
   */
  async use(req: Request, res: Response, next: NextFunction) {
    if ((req.method !== 'GET' && req.method !== 'DELETE')
        && req.body.hasOwnProperty("type") && req.body.type === 'password'
        && req.body.hasOwnProperty("password") && req.body.password.length <= 20) {
      // Non-encrypted passwords have to be of size less than 20 and
      // encrypted passwords are always of size greater than 20
      const encryptedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = encryptedPassword;
    }
    next();
  }
}

/* It checks if the request is a POST or PUT request and if the password field is
present in the request body. If both conditions are true, it encrypts the
password and replaces the plain text password with the encrypted password in the
request body */
@Injectable()
export class userPasswordEncryptionMiddleware implements NestMiddleware {
  /**
   * If the request method is not GET or DELETE and the request body has a password
   * property and the password is not empty and the password is less than 20
   * characters, then encrypt the password and set the request body's password
   * property to the encrypted password
   * @param {Request} req - Request - The request object
   * @param {Response} res - Response - The response object
   * @param {NextFunction} next - This is a function that is called when the
   * middleware is done.
   */
  async use(req: Request, res: Response, next: NextFunction) {
    if ((req.method !== 'GET' && req.method !== 'DELETE')
        && req.body.hasOwnProperty("password") && req.body.password !== ''
        && req.body.password.length <= 20) { //Non-encrypted passwords have to be of size less than 20 and encrypted passwords are always of size greater than 20
      const encryptedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = encryptedPassword;
    }
    next();
  }
}
