import { IsString } from 'class-validator';

// DTO = Data Transfer Object
// defines the format of the data sent in a request
export class CreatePostDto {
	@IsString()
	content: string;

	title: string;
}
