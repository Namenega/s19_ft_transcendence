import { Type } from "class-transformer";
import { IsInt, IsString, Min, ValidateNested } from "class-validator";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DirectMessageEntity } from "./directMessage.entity";

/* This class is a list of direct messages that are associated with a user */
@Entity({ orderBy: { order: "DESC" } })
export class DirectMessageListEntity {
	/* Telling the database that the id is a primary key and it is auto generated. */
	@PrimaryGeneratedColumn()
	id: number

	/* Telling the database that the user is a user entity. */
	@ManyToOne(() => UserEntity, {eager: true})
	@JoinColumn()
	@ValidateNested()
	@Type(() => UserEntity)
	user: UserEntity

	/* Telling the database that the message is a direct message entity. */
	@ManyToOne(() => DirectMessageEntity, DirectMessageEntity => DirectMessageEntity.messages)
	@JoinColumn()
	@ValidateNested()
	@Type(() => DirectMessageEntity)
	dm: DirectMessageEntity

	/* A decorator that is telling the database that the content is a string. */
	@Column()
	@IsString()
	content: string

	/* A column in the database that is an integer and is greater than 0. */
	@Column()
	@IsInt()
	@Min(0)
	order:number
}
