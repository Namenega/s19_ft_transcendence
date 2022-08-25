import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { MatchHistoryEntity } from "src/match-history/entities/matchHistory.entity";
import { FriendsEntity } from "src/friends/entities/friends.entity";
import { ChannelsEntity } from "src/channels/entities/channels.entity";
import { DirectMessageEntity } from "src/direct-message/entities/directMessage.entity";
import { ValidateNested, IsNotEmpty, IsString, IsBoolean, IsInt, Min, IsArray, IsOptional, IsNumberString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

/* It creates a table in the database called UserEntity, and it has a primary key
called id */
@Entity()
export class UserEntity {
	/* Creating a primary key for the table. */
	@PrimaryGeneratedColumn()
	id: number;

	/* Creating a column in the database called name, and it is unique, not empty,
	and a string. */
	@Column({unique: true})
	@IsNotEmpty()
	@IsString()
	name: string;

	/* Creating a column in the database called login, and it is unique, not empty,
	and a string. */
	@Column({unique: true})
	@IsNotEmpty()
	@IsString()
	login: string;

	/* Creating a column in the database called password, and it is a string. */
	@Column()
	@IsString()
	password: string;

	/* Creating a column in the database called avatar, and it is a string. */
	@Column()
	@IsString()
	avatar: string;

	/* Creating a column in the database called has2FA, and it is a boolean. */
	@Column()
	@IsBoolean()
	has2FA: boolean;

	/* Creating a column in the database called secret2FA, and it is a string. */
	@Column()
	@IsString()
	secret2FA: string;

	/* A validation for the status column. */
	@Column()
	@IsIn(["Online", "Offline", "In a game", "Searching a game"])
	status: string;

	/* Creating a column in the database called numberOfWin, and it is an integer. */
	@Column()
	@IsInt()
	@Min(0)
	numberOfWin: number;

	/* Creating a column in the database called numberOfLoss, and it is an integer. */
	@Column()
	@IsInt()
	@Min(0)
	numberOfLoss: number;

	@Column()
	@IsInt()
	@Min(0)
	elo: number;

	/* Creating a one to many relationship between the UserEntity and the
	MatchHistoryEntity. */
	@OneToMany(() => MatchHistoryEntity, (matchHistory) => matchHistory.user)
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => MatchHistoryEntity)
	matchHistory: MatchHistoryEntity[];

	/* Creating a one to many relationship between the UserEntity and the
	FriendsEntity. */
	@OneToMany(() => FriendsEntity, (friends) => friends.user)
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => FriendsEntity)
	friends: FriendsEntity[];

	/* Creating a many to many relationship between the UserEntity and the
	DirectMessageEntity. */
	@ManyToMany(() => DirectMessageEntity, (dms) => dms.users)
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => DirectMessageEntity)
	dms: DirectMessageEntity[];

	/* Creating a many to many relationship between the UserEntity and the
	ChannelsEntity. */
	@ManyToMany(() => ChannelsEntity, (channels) => channels.users)
	@JoinTable()
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ChannelsEntity)
	channels: ChannelsEntity[];

	/* A column in the database called latestTimeOnline, and it is a string. */
	@Column()
	@IsString()
	@IsNotEmpty()
	@IsNumberString()
	latestTimeOnline: string;
}
