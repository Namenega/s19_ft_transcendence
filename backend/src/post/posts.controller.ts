import { Controller, Body, Delete, Get, Param, Post, Put } from '@nestjs/common';
import PostsService from './posts.service';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';

@Controller('posts')
export default class PostController {
	constructor(private readonly postsService: PostsService) {}

	// @xxx = handler for a specific endpoint for HTTP requests
	// by default Nest responds with 200 OK status
	@Get()		// GET /post
	getAllPosts() {
		return this.postsService.getAllPosts();
	}

	@Get(':id')	// GET /post/{id}
	getPostById(@Param('id') id: string) {
		return this.postsService.getPostById(Number(id));
	}

	@Post()		// POST /post
	async createPost(@Body() post: CreatePostDto) {
		return this.postsService.createPost(post);
	}

	@Put(':id')	// PUT /post/{id}
	async replacePost(@Param('id') id: string, @Body() post: UpdatePostDto) {
		return this.postsService.replacePost(Number(id), post);
	}

	@Delete(':id')	// DELETE /post/{id}
	async deletePost(@Param('id') id: string) {
		return this.postsService.deletePost(Number(id));
	}
}
