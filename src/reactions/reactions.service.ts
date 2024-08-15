import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { UpdateReactionDto } from './dto/update-reaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reaction } from './entities/reaction.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Post } from 'src/posts/entities/post.entity';
import { EmoticonsDriver } from 'src/emoticons-driver/entities/emoticons-driver.entity';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(Reaction)
    private reactionsRepository: Repository<Reaction>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(EmoticonsDriver)
    private emoticonsDriverRepository: Repository<EmoticonsDriver>,

    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async create(createReactionDto: CreateReactionDto, user_id: string) {
    const userFinded = await this.usersRepository.findOneBy({
      id: user_id,
    });

    if (!userFinded) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    const emoticonsDriverFinded =
      await this.emoticonsDriverRepository.findOneBy({
        id: createReactionDto.emoticons_driver,
      });

    if (!emoticonsDriverFinded) {
      throw new HttpException(
        'Emoticons de motorista não encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    const postFinded = await this.postsRepository.findOneBy({
      id: createReactionDto.post,
    });

    if (!postFinded) {
      throw new HttpException('Post não encontrado', HttpStatus.NOT_FOUND);
    }

    const reactions = await this.reactionsRepository.create({
      ...createReactionDto,
      user: user_id as any,
    });

    return this.reactionsRepository.save(reactions);
  }

  findAll() {
    return this.reactionsRepository.find({
      relations: {
        post: true,
        user: true,
        emoticons_driver: true,
      },
    });
  }

  async findOne(id: string) {
    const responseReactions = await this.reactionsRepository.findOneBy({ id });

    if (!responseReactions) {
      throw new HttpException('Reação não encontradoa', HttpStatus.NOT_FOUND);
    }

    return responseReactions;
  }

  async findReactionsByPost(idPost: string) {
    const postFinded = await this.postsRepository.findOneBy({
      id: idPost,
    });

    if (!postFinded) {
      throw new HttpException('Post não encontrado', HttpStatus.NOT_FOUND);
    }

    const emoticonsFinded = await this.reactionsRepository
      .createQueryBuilder('reactions')
      .innerJoinAndSelect('reactions.post', 'post')
      .innerJoinAndSelect('reactions.user', 'user')
      .where('reactions.postId = :idPost', { idPost })
      .getMany();

    return emoticonsFinded;
  }

  async update(
    id: string,
    updateReactionDto: UpdateReactionDto,
    user_id: string,
  ) {
    const userFinded = await this.usersRepository.findOneBy({
      id: user_id,
    });

    if (!userFinded) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    const emoticonsDriverFinded =
      await this.emoticonsDriverRepository.findOneBy({
        id: updateReactionDto.emoticons_driver,
      });

    if (!emoticonsDriverFinded) {
      throw new HttpException(
        'Emoticons de motorista não encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    const postFinded = await this.postsRepository.findOneBy({
      id: updateReactionDto.post,
    });

    if (!postFinded) {
      throw new HttpException('Post não encontrado', HttpStatus.NOT_FOUND);
    }

    const reactionFinded = await this.reactionsRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        id,
      },
    });

    if (!reactionFinded) {
      throw new HttpException('Reação não encontrada', HttpStatus.NOT_FOUND);
    }

    if (reactionFinded.user.id !== user_id) {
      throw new HttpException(
        'Você não tem permissão para editar esta reação',
        HttpStatus.FORBIDDEN,
      );
    }

    return this.reactionsRepository.update(id, {
      ...updateReactionDto,
      updated_at: new Date(),
    });
  }

  async remove(idPost: string, userId: string) {
    const responseReactions = await this.reactionsRepository
      .createQueryBuilder('Reactions')
      .where('Reactions.userId = :userId', { userId })
      .andWhere('Reactions.postId = :idPost', { idPost })
      .getOne();

    if (!responseReactions) {
      throw new HttpException('Reação não encontradoa', HttpStatus.NOT_FOUND);
    }

    return this.reactionsRepository.delete(responseReactions.id);
  }
}
