import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostsSaveDto } from './dto/create-posts-save.dto';
import { UpdatePostsSaveDto } from './dto/update-posts-save.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsSave } from './entities/posts-save.entity';
import { User } from 'src/users/entities/user.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Reaction } from 'src/reactions/entities/reaction.entity';

@Injectable()
export class PostsSavesService {
  constructor(
    @InjectRepository(PostsSave)
    private postSaveRepository: Repository<PostsSave>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Reaction)
    private reactionsRepository: Repository<Reaction>,
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

  async getReactionsPostsByUser(userId: string) {
    return await this.reactionsRepository
      .createQueryBuilder('reactions')
      .where('reactions.userId = :userId', { userId })
      .innerJoinAndSelect('reactions.post', 'post')
      .getMany();
  }

  async findAll(userId: string, limit: number, page: number) {
    const [responsePosts, total] = await this.postSaveRepository
      .createQueryBuilder('postsSave')
      .leftJoinAndSelect('postsSave.post', 'post')
      .leftJoinAndSelect('post.reactions', 'reactions')
      .leftJoinAndSelect('post.comments', 'comments')
      .leftJoinAndSelect('post.user', 'user')
      .select([
        'postsSave.id',
        'post.id',
        'post.picture',
        'post.city_id',
        'post.comment',
        'post.tags',
        'post.created_at',
        'post.updated_at',
        'user.id',
        'user.name',
        'user.username',
        'user.photo_profile',
        'comments.id',
        'reactions.id',
        'reactions.emoticonsDriverId',
      ])
      .where('postsSave.user.id = :userId', { userId })
      .orderBy('post.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const listReactionsPostByUser = await this.getReactionsPostsByUser(userId);
    const idsPostsReactions = listReactionsPostByUser.map(
      (response) => response.post.id,
    );

    const responsePostsWithReactionsAndPostsSaved = responsePosts.map(
      (postSave) => {
        const { post } = postSave;

        return {
          id: post.id,
          picture: post.picture,
          city_id: post.city_id,
          comment: post.comment,
          tags: post.tags,
          created_at: post.created_at,
          updated_at: post.updated_at,
          user: {
            id: post.user.id,
            name: post.user.name,
            username: post.user.username,
            photo_profile: post.user.photo_profile,
          },
          comments: post.comments.length,
          reactions: post.reactions.length,
          is_reacted: idsPostsReactions.includes(post.id),
          is_saved: true,
        };
      },
    );

    return {
      items: responsePostsWithReactionsAndPostsSaved,
      totalItems: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
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
