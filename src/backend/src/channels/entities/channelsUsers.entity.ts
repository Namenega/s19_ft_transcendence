import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ChannelsEntity } from "./channels.entity";
import { UserEntity } from "../../users/entities/user.entity";
import { ValidateNested, IsBoolean } from "class-validator";
import { Type } from 'class-transformer';

/* This class is used to create a many-to-many relationship between the UserEntity
and ChannelsEntity classes */
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
	owner: boolean

	@Column()
	@IsBoolean()
	administrator: boolean

	@Column()
	@IsBoolean()
	mute: boolean
}
