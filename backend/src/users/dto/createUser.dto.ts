
/* It's a class that defines the shape of the data that we want to send to the
server when we create a new user */
export class CreateUserDto {
	email: string;
	name: string;
	password: string;
}
export default CreateUserDto;
