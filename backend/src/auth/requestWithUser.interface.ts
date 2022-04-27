import { Request } from "express";
import User from "src/users/entity/user.entity";

/* Extending the Request interface with a user property. */
interface RequestWithUser extends Request {
	user: User;
}
export default RequestWithUser;
