import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class Post {
	// primary key : identifies a row uniquely in a table
	// usually create an id column
	// from typeOrm : integer primary coluumn that has auto generated value
	@PrimaryGeneratedColumn()
	public id: number;

	// marks a property as a column
	@Column()
	public title: string;

	@Column()
	public content: string;
}

export default Post;
