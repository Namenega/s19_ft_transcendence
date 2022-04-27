import { IsString } from 'class-validator';

/* The CreatePostDto class is a Data Transfer Object (DTO) that defines the shape
of the data that will be sent to the server when creating a new post */
export class CreatePostDto {
	@IsString()
	content: string;

	title: string;
}
