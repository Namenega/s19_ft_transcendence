import { Type } from "class-transformer";
import { IsIn, IsInt, Max, Min, ValidateIf, ValidateNested } from "class-validator";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GamesEntity {
    /* A primary key. */
    @PrimaryGeneratedColumn()
    id: number;

    /* A relation to the user-entity. */
    @OneToOne(type => UserEntity)
    @JoinColumn()
    @ValidateNested()
    @Type(() => UserEntity)
    user1: UserEntity;

    /* A relation to the user-entity. */
    @OneToOne(type => UserEntity, {nullable: true})
    @JoinColumn()
    @ValidateIf(value => value === null) //If is equal to null all following validator-decorators are ignored
    @ValidateNested()
    @Type(() => UserEntity)
    user2: UserEntity;

    /* A column in the database, which is an integer and has a minimum of 1 and a
    maximum of 3. */
    @Column()
    @IsInt()
    @Min(1)
    @Max(3)
    ballspeed: number;

    /* A column in the database, which is a string and has to be one of the
    following values: 'black', 'white', 'winter', 'summer', 'night'. */
    @Column()
    @IsIn(['black', 'white', 'winter', 'summer', 'night'])
    map: string;
}
