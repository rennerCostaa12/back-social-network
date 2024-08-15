import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostsSaveDto } from './dto/create-posts-save.dto';
import { UpdatePostsSaveDto } from './dto/update-posts-save.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsSave } from './entities/posts-save.entity';
import { User } from 'src/users/entities/user.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsSavesService {
  constructor(
    @InjectRepository(PostsSave)
    private postSaveRepository: Repository<PostsSave>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(createPostsSaveDto: CreatePostsSaveDto, userId: string) {
    const userFinded = await this.userRepository.findOneBy({
      id: userId,
    });

    if (!userFinded) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    const postFinded = await this.postRepository.findOneBy({
      id: createPostsSaveDto.post,
    });

    if (!postFinded) {
      throw new HttpException('Post não encontrado', HttpStatus.NOT_FOUND);
    }

    const post = this.postSaveRepository.create({
      ...createPostsSaveDto,
      user: userId as any,
    });

    return this.postSaveRepository.save(post);
  }

  findAll() {
    return this.postSaveRepository.find({
      relations: {
        user: true,
        post: true,
      },
    });
  }

  async findOne(id: number) {
    const postSaveFinded = await this.postSaveRepository.findOne({
      relations: {
        user: true,
        post: true,
      },
      where: {
        id,
      },
    });

    if (!postSaveFinded) {
      throw new HttpException('Post não encontrado', HttpStatus.NOT_FOUND);
    }

    return postSaveFinded;
  }

  async update(
    id: number,
    updatePostsSaveDto: UpdatePostsSaveDto,
    userId: string,
  ) {
    const userFinded = await this.userRepository.findOneBy({
      id: userId,
    });

    if (!userFinded) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    const postFinded = await this.postRepository.findOneBy({
      id: updatePostsSaveDto.post,
    });

    if (!postFinded) {
      throw new HttpException('Post não encontrado', HttpStatus.NOT_FOUND);
    }

    const postSaveUpdated = this.postSaveRepository.update(id, {
      ...updatePostsSaveDto,
      updated_at: new Date(),
    });

    return postSaveUpdated;
  }

  async remove(idPost: string, userId: string) {
    const findPostSaved = await this.postSaveRepository
      .createQueryBuilder('postsSave')
      .where('postsSave.userId = :userId', { userId })
      .andWhere('postsSave.postId = :idPost', { idPost })
      .getOne();

    return this.postSaveRepository.delete(findPostSaved.id);
  }
}
