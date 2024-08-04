import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Post } from './entities/post.entity';
import { StatusPosts } from 'src/constants/StatusPosts/status_posts';
import { User } from 'src/users/entities/user.entity';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

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

  async findPostByUser(userId: string) {
    const userFinded = await this.usersRepository.findOneBy({ id: userId });

    if (!userFinded) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    const postStats = await this.postRepository
      .createQueryBuilder('posts')
      .leftJoin('posts.reactions', 'reactions')
      .leftJoin('posts.comments', 'comments')
      .leftJoin('posts.user', 'user')
      .select([
        'posts.id as id',
        'posts.picture as picture',
        'posts.city_id as city_id',
        'posts.tags as tags',
        'posts.created_at as created_at',
        'posts.updated_at as updated_at',
        'user.name as name_user',
        'user.username as username',
        'user.photo_profile as photo_profile',
      ])
      .addSelect('COUNT(DISTINCT reactions.id)', 'reactions')
      .addSelect('COUNT(DISTINCT comments.id)', 'comments')
      .where('posts.userId = :userId', { userId })
      .groupBy('posts.id')
      .getRawMany();

    const postsUsersCount = await this.postRepository
      .createQueryBuilder('posts')
      .where('posts.userId = :userId', { userId })
      .getCount();

    return {
      posts_counts: postsUsersCount,
      posts: postStats,
    };
  }
}
