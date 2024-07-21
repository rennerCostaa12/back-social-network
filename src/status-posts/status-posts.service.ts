import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStatusPostDto } from './dto/create-status-post.dto';
import { UpdateStatusPostDto } from './dto/update-status-post.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { StatusPost } from './entities/status-post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StatusPostsService {
  constructor(
    @InjectRepository(StatusPost)
    private statusPostRepository: Repository<StatusPost>,
  ) {}

  // create(createStatusPostDto: CreateStatusPostDto) {
  //   const statusPost = this.statusPostRepository.create(createStatusPostDto);
  //   return this.statusPostRepository.save(statusPost);
  // }

  findAll() {
    return this.statusPostRepository.find();
  }

  async findOne(id: number) {
    const statusPost = await this.statusPostRepository.findOneBy({ id });

    if (!statusPost) {
      throw new HttpException(
        'Status de post não encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    return statusPost;
  }

  // async update(id: number, updateStatusPostDto: UpdateStatusPostDto) {
  //   const statusPost = await this.statusPostRepository.findOneBy({ id });

  //   if (!statusPost) {
  //     throw new HttpException(
  //       'Status de post não encontrado',
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }

  //   const postStatusUpdated = this.statusPostRepository.update(id, {
  //     ...updateStatusPostDto,
  //     updated_at: new Date(),
  //   });

  //   return postStatusUpdated;
  // }
}
