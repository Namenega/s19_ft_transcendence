import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreatePostDto } from './dto/createPost.dto';
import Post from './entity/post.entity';
import { UpdatePostDto } from './dto/updatePost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

@Injectable()
export default class PostsService {
	private lastPostId = 0;
	private posts: Post[] = [];

	constructor(
		@InjectRepository(Post)
		private postsRepository: Repository<Post>
	) {}

	/**
	 * It returns all the posts from the database
	 * @returns An array of posts
	 */
	getAllPosts() {
		return this.postsRepository.find();
	}

	/**
	 * It gets a post by its id
	 * @param {number} id - number - The id of the post we want to retrieve.
	 * @returns The post with the given id.
	 */
	async getPostById(id: number) {
		const post = await this.postsRepository.findOne(id);
		if (post) {
			return post;
		}
		throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
	}

	/**
	 * We're going to find the index of the post we want to update, and if it exists,
	 * we're going to update it
	 * @param {number} id - number - The id of the post we want to update.
	 * @param {UpdatePostDto} post - UpdatePostDto - This is the data that we want to
	 * update the post with.
	 * @returns The post that was updated.
	 */
	replacePost(id: number, post: UpdatePostDto) {
		const postIndex = this.posts.findIndex(post => post.id === id);
		if (postIndex > -1) {
			this.posts[postIndex] = post;
			return post;
		}
		throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
	}

	/**
	 * It creates a new post and saves it to the database
	 * @param {CreatePostDto} post - CreatePostDto - This is the data that we want to
	 * pass to the method.
	 * @returns The new post that was created.
	 */
	async createPost(post: CreatePostDto) {
		const newPost = await this.postsRepository.create(post);
		await this.postsRepository.save(newPost);
		return newPost;
	}

	/**
	 * It updates a post with the given id and returns the updated post
	 * @param {number} id - number - The id of the post we want to update.
	 * @param {UpdatePostDto} post - UpdatePostDto - This is the DTO that we created
	 * earlier.
	 * @returns The updated post
	 */
	async updatePost(id: number, post: UpdatePostDto) {
		await this.postsRepository.update(id, post);
		const updatedPost = await this.postsRepository.findOne(id);
		if (updatedPost) {
			return updatedPost;
		}
		throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
	}

	/**
	 * We're using the delete method from the postsRepository to delete a post by its
	 * id. 
	 * 
	 * If the delete method returns an affected value of 0, then we throw an
	 * HttpException with a message of 'Post not found' and a status of
	 * HttpStatus.NOT_FOUND
	 * @param {number} id - number - The id of the post to delete
	 */
	async deletePost(id: number) {
		const deleteResponse = await this.postsRepository.delete(id);
		if (!deleteResponse.affected) {
			throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
		}
	}
}
