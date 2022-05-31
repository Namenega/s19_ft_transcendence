import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ChannelsEntity } from "./channels.entity";
import { UserEntity } from "../../users/entities/user.entity";
import { ValidateNested, IsBoolean } from "class-validator";
import { Type } from 'class-transformer';

@Entity()
export class ChannelsUsersEntity {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => UserEntity, {eager: true})
	@JoinColumn()
	@ValidateNested()
	@Type(() => UserEntity)
	user: UserEntity

	@ManyToOne(type => ChannelsEntity, ChannelsEntity => ChannelsEntity.channel_users)
	@JoinColumn()
	@ValidateNested()
	@Type(() => ChannelsEntity)
	channel: ChannelsEntity

	@Column()
	@IsBoolean()
	channelOwner: boolean

	@Column()
	@IsBoolean()
	channelAdministrator: boolean

	@Column()
	@IsBoolean()
	mute: boolean
}
