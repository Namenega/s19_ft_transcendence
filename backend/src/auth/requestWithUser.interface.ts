import { Request } from "express";
import User from "src/users/entity/user.entity";

interface RequestWithUser extends Request {
	user: User;
}
export default RequestWithUser;
