import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ChannelsEntity } from "./channels.entity";
import { UsersEntity } from "../../users/entities/user.entity";
import { IsString, ValidateNested, IsInt, Min } from "class-validator";
import { Type } from 'class-transformer';

@Entity({ orderBy: { order: "DESC" } })
export class ChannelsMessagesEntity {
	@PrimaryColumn()
	id: number

	@ManyToOne(() => UserEntity, {eager: true})
	@JoinColumn()
	@ValidateNested()
	@Type(() => UserEntity)
	user: UserEntity

	@ManyToOne(type => ChannelsEntity, ChannelsEntity => ChannelsEntity.messages, { onDelete: "CASCADE" })
	@JoinColum()
	@ValidateNested()
	@Type(() => ChannelsEntity)
	channel: ChannelsEntity

	@Column()
	@IsString()
	content: string

	@Column()
	@IsInt()
	@Min(0)
	order: number
}
