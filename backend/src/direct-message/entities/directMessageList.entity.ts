import { Type } from "class-transformer";
import { IsInt, Min, ValidateNested } from "class-validator";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DirectMessageEntity } from "./directMessage.entity";

@Entity({ orderBy: { order: "DESC" } })
export class DirectMessageListEntity {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => UserEntity, {eager: true})
	@JoinColumn()
	@ValidateNested()
	@Type(() => UserEntity)
	user: UserEntity

	@ManyToOne(type => DirectMessageEntity, DirectMessageEntity => DirectMessageEntity.messages)
	@JoinColumn()
	@ValidateNested()
	@Type(() => DirectMessageEntity)
	message: DirectMessageEntity

	@Column()
	@IsInt()
	@Min(0)
	order:number
}
