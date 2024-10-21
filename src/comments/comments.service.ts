import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CommentsService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    endpoint: process.env.AWS_ENDPOINT,
    forcePathStyle: true,
  });

  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
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
    createCommentDto: CreateCommentDto,
    comment: Express.Multer.File,
  ) {
    if (!comment) {
      throw new HttpException(
        'Comentário é obrigatório',
        HttpStatus.BAD_REQUEST,
      );
    }

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

    const fileNameComments = `comments/list/${comment.originalname}`;

    await this.uploadFileS3(
      fileNameComments,
      comment.buffer,
      process.env.AWS_BUCKET,
    );

    const url_comment = `${process.env.AWS_ENDPOINT}${process.env.AWS_BUCKET}/comments/list/${comment.originalname}`;

    const comments = this.commentsRepository.create({
      ...createCommentDto,
      comment: url_comment,
    });

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

  async remove(id: string, idUser: string) {
    const commentFinded = await this.commentsRepository.findOne({
      relations: {
        user: true,
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

    if (commentFinded.user.id !== idUser) {
      throw new HttpException(
        'Você não permissão para deletar este comentário',
        HttpStatus.FORBIDDEN,
      );
    }

    this.commentsRepository.delete(id);

    return {
      message: 'Deletado com sucesso',
      data: commentFinded,
    };
  }

  async findCommentByPost(id: string) {
    const commentFinded = await this.commentsRepository.find({
      relations: {
        post: true,
        user: true,
      },
      where: {
        post: {
          id,
        },
      },
      order: {
        created_at: 'ASC',
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
}
