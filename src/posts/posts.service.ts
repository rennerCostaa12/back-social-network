import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Post } from './entities/post.entity';
import { StatusPosts } from 'src/constants/StatusPosts/status_posts';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  create(createPostDto: CreatePostDto) {
    const post = this.postRepository.create({
      ...createPostDto,
      status_posts: StatusPosts.analysis as any,
    });
    return this.postRepository.save(post);
  }

  findAll() {
    return this.postRepository.find();
  }

  async findOne(id: string) {
    const postFinded = await this.postRepository.findOneBy({ id });

    if (!postFinded) {
      throw new HttpException('Post não encontrado', HttpStatus.NOT_FOUND);
    }

    return postFinded;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const postFinded = await this.postRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        id,
      },
    });

    if (!postFinded) {
      throw new HttpException('Post não encontrado', HttpStatus.NOT_FOUND);
    }

    if (updatePostDto.user !== postFinded.user.id) {
      throw new HttpException(
        'Você não tem permissão para editar este post',
        HttpStatus.FORBIDDEN,
      );
    }

    const postUpdated = this.postRepository.update(id, {
      ...updatePostDto,
      updated_at: new Date(),
    });

    return postUpdated;
  }

  async remove(id: string) {
    const postFinded = await this.postRepository.findOneBy({ id });

    if (!postFinded) {
      throw new HttpException('Post não encontrado', HttpStatus.NOT_FOUND);
    }

    return this.postRepository.delete(id);
  }
}
