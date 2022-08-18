import { IsArray, IsBoolean, IsInt, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DirectMessageListEntity } from "./directMessageList.entity";

/* This class is a direct message entity that has a many to many relationship with
the user entity, a one to many relationship with the direct message list entity,
and a few columns */
@Entity()
export class DirectMessageEntity {
	/* Creating a primary key for the table. */
	@PrimaryGeneratedColumn()
	id: number

	/* This is a many to many relationship between the direct message entity and the
	user entity. */
	@ManyToMany(type => UserEntity, UserEntity => UserEntity.dms, {eager: true})
	@JoinTable()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => UserEntity)
	users: UserEntity[]

	/* This is a one to many relationship between the direct message entity and the
	direct message list entity. */
	@OneToMany(type => DirectMessageListEntity, DirectMessageListEntity => DirectMessageListEntity.dm, {eager: true, cascade: true})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => DirectMessageListEntity)
	messages: DirectMessageListEntity[]

	/* This is a column that is a boolean that is called block. */
	@Column()
	@IsBoolean()
	block: boolean

	/* This is a column that is a boolean that is called block. */
	@Column({ nullable: false,type: "int", default: 0 })
	@IsInt()
	@Min(0)
	blockerUserId: number
}
