import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

import { Post } from './entities/post.entity';
import { StatusPosts } from 'src/constants/StatusPosts/status_posts';
import { User } from 'src/users/entities/user.entity';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

import { ValidationDurationVideo } from 'src/utils/ValidationsDurationVideo';
import { UploadFileLocal } from 'src/utils/UploadFileLocal';
import { Reaction } from 'src/reactions/entities/reaction.entity';
import { PostsSave } from 'src/posts-saves/entities/posts-save.entity';

@Injectable()
export class PostsService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });

  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Reaction)
    private reactionsRepository: Repository<Reaction>,
    @InjectRepository(PostsSave)
    private postsSaveRepository: Repository<PostsSave>,
    private readonly configService: ConfigService,
  ) {}

  async uploadFileS3(fileName: string, file: Buffer, bucket: string) {
    return await this.s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: fileName,
        Body: file,
        ACL: 'public-read',
      }),
    );
  }

  async create(
    createPostDto: CreatePostDto,
    img_picture: Express.Multer.File[],
    comment: Express.Multer.File[],
  ) {
    if (!comment) {
      throw new HttpException(
        'Comentário é obrigatório',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!img_picture) {
      throw new HttpException(
        'Vídeo/Imagem é obrigatório',
        HttpStatus.BAD_REQUEST,
      );
    }

    const localFilePath = path.resolve(
      __dirname,
      '../tmp/uploads',
      img_picture[0].originalname,
    );
    await UploadFileLocal(img_picture[0].buffer, localFilePath);

    const responseDurationVideo = await ValidationDurationVideo(localFilePath);

    fs.unlinkSync(localFilePath);

    if (!responseDurationVideo) {
      throw new HttpException(
        'O vídeo excedeu o limite de duração',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.uploadFileS3(
      img_picture[0].originalname,
      img_picture[0].buffer,
      'social-network-mobility-pro-teste',
    );

    await this.uploadFileS3(
      comment[0].originalname,
      comment[0].buffer,
      'social-network-mobility-pro-teste',
    );

    const url_picture = `https://social-network-mobility-pro-teste.s3.amazonaws.com/${img_picture[0].originalname}`;
    const url_audio = `https://social-network-mobility-pro-teste.s3.amazonaws.com/${comment[0].originalname}`;

    const post = this.postRepository.create({
      ...createPostDto,
      status_posts: StatusPosts.analysis as any,
      comment: url_audio,
      picture: url_picture,
    });

    return this.postRepository.save(post);
  }

  findAll() {
    return this.postRepository.find();
  }

  async findOne(id: string, user_id: string) {
    const postFinded = await this.postRepository.findOneBy({ id });

    if (!postFinded) {
      throw new HttpException('Post não encontrado', HttpStatus.NOT_FOUND);
    }

    return postFinded;
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    picture: Express.Multer.File[],
    comment: Express.Multer.File[],
  ) {
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

    let url_picture: string = postFinded.picture;
    let url_audio: string = postFinded.comment;

    if (picture) {
      const localFilePath = path.resolve(
        __dirname,
        '../tmp/uploads',
        picture[0].originalname,
      );
      await UploadFileLocal(picture[0].buffer, localFilePath);

      const responseDurationVideo =
        await ValidationDurationVideo(localFilePath);

      fs.unlinkSync(localFilePath);

      if (!responseDurationVideo) {
        throw new HttpException(
          'O vídeo excedeu o limite de duração',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.uploadFileS3(
        picture[0].originalname,
        picture[0].buffer,
        'social-network-mobility-pro-teste',
      );

      url_picture = `https://social-network-mobility-pro-teste.s3.amazonaws.com/${picture[0].originalname}`;
    }

    if (comment) {
      await this.uploadFileS3(
        comment[0].originalname,
        comment[0].buffer,
        'social-network-mobility-pro-teste',
      );

      url_audio = `https://social-network-mobility-pro-teste.s3.amazonaws.com/${comment[0].originalname}`;
    }

    const postUpdated = this.postRepository.update(id, {
      ...updatePostDto,
      comment: url_audio,
      picture: url_picture,
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

  async getReactionsPostsByUser(userId: string) {
    return await this.reactionsRepository
      .createQueryBuilder('reactions')
      .where('reactions.userId = :userId', { userId })
      .innerJoinAndSelect('reactions.post', 'post')
      .getMany();
  }

  async getPostsSavedByUser(userId: string) {
    return await this.postsSaveRepository
      .createQueryBuilder('postsSave')
      .where('postsSave.userId = :userId', { userId })
      .innerJoinAndSelect('postsSave.post', 'post')
      .getMany();
  }

  async findPostByUser(userId: string, idUserLoggedIn: string) {
    const userFinded = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!userFinded) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    const listReactionsPostByUser =
      await this.getReactionsPostsByUser(idUserLoggedIn);
    const listPostsSavedByUser = await this.getPostsSavedByUser(idUserLoggedIn);

    const idsPostsReactions = listReactionsPostByUser.map(
      (response) => response.post.id,
    );
    const idsPostsSaved = listPostsSavedByUser.map(
      (response) => response.post.id,
    );

    const postStats = await this.postRepository.find({
      where: { user: { id: userId } },
      relations: ['reactions', 'comments', 'user'],
      order: { created_at: 'DESC' },
    });

    const listsPostsWithStatusReacted = postStats.map((post) => {
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
        is_saved: idsPostsSaved.includes(post.id),
      };
    });

    const postsUsersCount = await this.postRepository.count({
      where: { user: { id: userId } },
    });

    return {
      posts_counts: postsUsersCount,
      posts: listsPostsWithStatusReacted,
    };
  }

  async getFollowingDetails(userId: string): Promise<User[]> {
    return await this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.followers', 'follow', 'follow.followerId = :userId', {
        userId,
      })
      .getMany();
  }

  async findPostsFromFollowingUsers(
    userId: string,
    limit: number,
    page: number,
  ) {
    const followingUsers = await this.getFollowingDetails(userId);
    const followingUserIds = followingUsers.map((user) => user.id);

    if (followingUserIds.length === 0) {
      throw new HttpException(
        'Você não está seguindo nenhum usuário',
        HttpStatus.NOT_FOUND,
      );
    }

    const listReactionsPostByUser = await this.getReactionsPostsByUser(userId);
    const listPostsSavedByUser = await this.getPostsSavedByUser(userId);

    const idsPostsReactions = listReactionsPostByUser.map(
      (response) => response.post.id,
    );
    const idsPostsSaved = listPostsSavedByUser.map(
      (response) => response.post.id,
    );

    const offset = (page - 1) * limit;

    const totalPosts = await this.postRepository
      .createQueryBuilder('post')
      .where('post.user IN (:...followingUserIds)', {
        followingUserIds: [...followingUserIds, userId],
      })
      .getCount();

    const query = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.reactions', 'reactions')
      .leftJoinAndSelect('post.comments', 'comments')
      .where('post.user IN (:...followingUserIds)', {
        followingUserIds: [...followingUserIds, userId],
      })
      .orderBy('post.created_at', 'DESC')
      .skip(offset)
      .take(limit)
      .getMany();
      
    const listPostsFeed = query.map((response) => {
      return {
        id: response.id,
        picture: response.picture,
        city_id: response.city_id,
        comment: response.comment,
        tags: response.tags,
        created_at: response.created_at,
        updated_at: response.updated_at,
        user: {
          id: response.user.id,
          name: response.user.name,
          username: response.user.username,
          photo_profile: response.user.photo_profile,
        },
        comments: response.comments.length,
        reactions: response.reactions.length,
        is_reacted: idsPostsReactions.includes(response.id),
        is_saved: idsPostsSaved.includes(response.id),
      };
    });

    const totalPages = Math.ceil(totalPosts / limit);

    const meta = {
      totalItems: totalPosts,
      itemCount: listPostsFeed.length,
      itemsPerPage: limit,
      totalPages: totalPages,
      currentPage: page,
    };

    return {
      data: listPostsFeed,
      meta,
    };
  }
}
