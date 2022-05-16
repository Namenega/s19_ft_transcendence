import { Injectable } from '@nestjs/common';
import { CreateMatchHistoryDto } from './dto/createMatchHistory.dto';
import { UpdateMatchHistoryDto } from './dto/updateMatchHistory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchHistoryEntity } from './entities/matchHistory.entity';

@Injectable()
export class MatchHistoryService {
	constructor(
		@InjectRepository(MatchHistoryEntity)
		private MatchHistoryRepo: Repository<MatchHistoryEntity>
	  ) {}
	
	  async create(createMatchHistoryDto: CreateMatchHistoryDto): Promise<void> {
		await this.MatchHistoryRepo.save(createMatchHistoryDto);
	  }
	
	  async findAll(): Promise<MatchHistoryEntity[]>  {
		return await this.MatchHistoryRepo.find();
	  }
	
	  async findMatchHistoryOfUser(login: string): Promise<MatchHistoryEntity[]> {
		return await this.MatchHistoryRepo.find({
		  relations: ['me'],
		  where: { me: {login: login} }});
	  }
	
	  async findOne(id: number): Promise<MatchHistoryEntity> {
		return await this.MatchHistoryRepo.findOne(id);;
	  }
	
	  async update(id: number, updateMatchHistoryDto: UpdateMatchHistoryDto): Promise<void>  {
		await this.MatchHistoryRepo.update(id, updateMatchHistoryDto);
	  }
	
	  async remove(id: number): Promise<void> {
		await this.MatchHistoryRepo.delete(id);
	  }
}
