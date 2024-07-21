import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { DeleteCommentDto } from './dto/delete.comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const userFinded = await this.usersRepository.findOneBy({
      id: createCommentDto.user,
    });

    if (!userFinded) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    const postFinded = await this.postsRepository.findOneBy({
      id: createCommentDto.post,
    });

    if (!postFinded) {
      throw new HttpException('Post não encontrado', HttpStatus.NOT_FOUND);
    }

    const comments = this.commentsRepository.create(createCommentDto);

    return this.commentsRepository.save(comments);
  }

  findAll() {
    return this.commentsRepository.find({
      relations: {
        user: true,
        post: true,
      },
    });
  }

  async findOne(id: string) {
    const commentFinded = await this.commentsRepository.findOne({
      relations: {
        user: true,
        post: true,
      },
      where: {
        id,
      },
    });

    if (!commentFinded) {
      throw new HttpException(
        'Comentário não encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    return commentFinded;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    const userFinded = await this.usersRepository.findOneBy({
      id: updateCommentDto.user,
    });

    if (!userFinded) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    const postFinded = await this.postsRepository.findOneBy({
      id: updateCommentDto.post,
    });

    if (!postFinded) {
      throw new HttpException('Post não encontrado', HttpStatus.NOT_FOUND);
    }

    return this.commentsRepository.update(id, {
      ...updateCommentDto,
      updated_at: new Date(),
    });
  }

  async remove(id: string, deleteCommentDto: DeleteCommentDto) {
    const { user: userId } = deleteCommentDto;

    const commentFinded = await this.commentsRepository.findOne({
      relations: {
        user: true,
      },
    });

    if (commentFinded.user.id !== userId) {
      throw new HttpException(
        'Você não permissão para deletar este comentário',
        HttpStatus.FORBIDDEN,
      );
    }

    return this.commentsRepository.delete(id);
  }

  async findCommentByPost(id: string) {
    const commentFinded = await this.commentsRepository.find({
      relations: {
        post: true,
        user: true
      },
      where: {
        post: {
          id
        }
      }
    });

    if(!commentFinded){
      throw new HttpException('Comentário não encontrado', HttpStatus.NOT_FOUND);
    }

    return commentFinded;
  }
}
