import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsString, IsEmail, IsNotEmpty } from "class-validator";

@Entity()
class User {
	@PrimaryGeneratedColumn()
	public id?: number;

	@IsEmail()
	@IsNotEmpty()
	@Column({ unique: true })
	public email: string;

	@IsString()
	@IsNotEmpty()
	@Column({ unique: true })
	public name: string;

	@IsString()
	@IsNotEmpty()
	@Column({ unique: true })
	public password: string;
}
export default User;
