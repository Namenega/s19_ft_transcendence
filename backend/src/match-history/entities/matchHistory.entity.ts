import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { ValidateNested, IsInt, IsPositive, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

@Entity()
export class MatchHistoryEntity {
	@PrimaryColumn()
	id: number;

	@ManyToOne(type => UserEntity, UserEntity => UserEntity.matchHistory, {eager: true})
	@JoinColumn()
	@ValidateNested()
	@Type(() => UserEntity)
	user: UserEntity;

	@Column()
	@IsInt()
	@Min(0)
	@Max(5)
	userScore: number;

	@Column()
	@IsInt()
	@IsPositive()
	opponentId: number;

	@Column()
	@IsInt()
	@Min(0)
	@Max(5)
	opponentScore: number;
}
