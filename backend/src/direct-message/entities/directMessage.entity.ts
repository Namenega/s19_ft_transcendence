import { IsArray, IsBoolean, IsInt, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DirectMessageListEntity } from "./directMessageList.entity";

@Entity()
export class DirectMessageEntity {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToMany(type => UserEntity, UserEntity => UserEntity.directMessage, {eager: true})
	@JoinTable()
	@IsArray()
	@ValidateNested({each: true})
	@Type(() => UserEntity)
	users: UserEntity[]

	@OneToMany(type => DirectMessageListEntity, DirectMessageListEntity => DirectMessageListEntity.message, {eager: true, cascade: true})
	@IsArray()
	@ValidateNested({each: true})
	@Type(() => DirectMessageListEntity)
	messages: DirectMessageListEntity[]

	@Column()
	@IsBoolean()
	block: boolean

	@Column({ nullable: false,type: "int", default: 0 })
	@IsInt()
	@Min(0)
	blockerUserId: number
}
