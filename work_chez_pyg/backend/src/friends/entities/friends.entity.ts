import { UserEntity } from "src/users/entities/user.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, Column } from "typeorm";
import { ValidateNested, IsInt, IsPositive } from "class-validator";
import { Type } from "class-transformer";


/* The FriendsEntity class is a database entity that represents a friendship between two users */
@Entity()
export class FriendsEntity {

	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(type => UserEntity, UserEntity => UserEntity.friends)
	@JoinColumn()
	@ValidateNested()
	@Type(() => UserEntity)
	user: UserEntity;

	@Column()
	@IsInt()
	@IsPositive()
	friendId: number;
}
