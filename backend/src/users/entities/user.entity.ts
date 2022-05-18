import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { MatchHistoryEntity } from "src/match-history/entities/matchHistory.entity";
import { FriendsEntity } from "src/friends/entities/friends.entity";
// import { ChannelsEntity } from "src/channels/entities/channels.entity";
// import { ChannelsUsersEntity } from "src/channels/entities/channels_users.entity";
// import { ChannelsMessagesEntity } from "src/channels/entities/channels_messages.entity";
// import { DmsEntity } from "src/dms/entities/dms.entity";
// import { DmsMessagesEntity } from "src/dms/entities/dms_messages.entity";
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
    password: string

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

   /* Creating a one to many relationship between the UserEntity and the
   MatchHistoryEntity. */
    @OneToMany(type => MatchHistoryEntity, MatchHistoryEntity => MatchHistoryEntity.user)
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MatchHistoryEntity)
    matchHistory: MatchHistoryEntity[]

    /* Creating a one to many relationship between the UserEntity and the
    FriendsEntity. */
    @OneToMany(type => FriendsEntity, FriendsEntity => FriendsEntity.user)
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FriendsEntity)
    friends: FriendsEntity[]

    // @ManyToMany(type => DmsEntity, DmsEntity => DmsEntity.users)
    // @IsOptional()
    // @IsArray()
    // @ValidateNested({ each: true })
    // @Type(() => DmsEntity)
    // dms: DmsEntity[]

    // @ManyToMany(type => ChannelsEntity, ChannelsEntity => ChannelsEntity.users)
    // @JoinTable()
    // @IsOptional()
    // @IsArray()
    // @ValidateNested({ each: true })
    // @Type(() => ChannelsEntity)
    // channels: ChannelsEntity[]

    /* A column in the database called latestTimeOnline, and it is a string. */
	@Column()
    @IsString()
    @IsNotEmpty()
    @IsNumberString()
    latestTimeOnline: string
    
}
