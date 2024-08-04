import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEmoticonsDriverDto } from './dto/create-emoticons-driver.dto';
import { UpdateEmoticonsDriverDto } from './dto/update-emoticons-driver.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EmoticonsDriver } from './entities/emoticons-driver.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CategoriesEmoji } from 'src/categories-emojis/entities/categories-emoji.entity';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmoticonsDriverService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });

  constructor(
    @InjectRepository(EmoticonsDriver)
    private emoticonsDriverRepository: Repository<EmoticonsDriver>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(CategoriesEmoji)
    private categoriesEmojiRepository: Repository<CategoriesEmoji>,

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
    createEmoticonsDriverDto: CreateEmoticonsDriverDto,
    imageDriver: Express.Multer.File,
  ) {
    const userFinded = await this.usersRepository.findOneBy({
      id: createEmoticonsDriverDto.user,
    });

    if (!userFinded) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    const categories = await this.categoriesEmojiRepository.findOneBy({
      id: createEmoticonsDriverDto.category,
    });

    if (!categories) {
      throw new HttpException(
        'Categoria de emoji não encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    const isExistsEmoticonsDriver =
      await this.emoticonsDriverRepository.findOne({
        where: {
          user: userFinded,
          category: categories,
        },
      });

    if (isExistsEmoticonsDriver) {
      throw new HttpException(
        'Você já cadastrou esse emoji',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.uploadFileS3(
      imageDriver.originalname,
      imageDriver.buffer,
      'social-network-mobility-pro-teste',
    );

    const urlImgDriver = `https://social-network-mobility-pro-teste.s3.amazonaws.com/${imageDriver.originalname}`;

    const emoticonsDriver = this.emoticonsDriverRepository.create({
      ...createEmoticonsDriverDto,
      category: Number(createEmoticonsDriverDto.category) as any,
      image: urlImgDriver,
    });

    return this.emoticonsDriverRepository.save(emoticonsDriver);
  }

  async emoticonsByUser(id: string) {
    const emoticonsFinded = await this.emoticonsDriverRepository
      .createQueryBuilder('emoticonsDriver')
      .innerJoinAndSelect('emoticonsDriver.category', 'category')
      .where('emoticonsDriver.userId = :id', { id })
      .getMany();

    return emoticonsFinded;
  }

  async findEmoticonsByUser(id: string) {
    const userFinded = await this.usersRepository.findOneBy({ id });

    if (!userFinded) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }
    return this.emoticonsByUser(id);
  }

  async findOne(id: number) {
    const emoticonsFinded = await this.emoticonsDriverRepository.findOneBy({
      id,
    });

    if (!emoticonsFinded) {
      throw new HttpException('Emoticon não encontrado', HttpStatus.NOT_FOUND);
    }

    return emoticonsFinded;
  }

  async update(id: number, updateEmoticonsDriverDto: UpdateEmoticonsDriverDto) {
    const emoticonsFinded = await this.emoticonsDriverRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        id,
      },
    });

    if (!emoticonsFinded) {
      throw new HttpException('Emoticon não encontrado', HttpStatus.NOT_FOUND);
    }

    if (emoticonsFinded.user.id !== updateEmoticonsDriverDto.user) {
      throw new HttpException(
        'Este usuário não tem permissão para alterar os dados do emoticon',
        HttpStatus.FORBIDDEN,
      );
    }

    return this.emoticonsDriverRepository.update(id, {
      ...updateEmoticonsDriverDto,
      updated_at: new Date(),
    });
  }

  async remove(id: number) {
    const emoticonsFinded = await this.emoticonsDriverRepository.findOneBy({
      id,
    });

    if (!emoticonsFinded) {
      throw new HttpException('Emoticon não encontrado', HttpStatus.NOT_FOUND);
    }

    return this.emoticonsDriverRepository.delete(id);
  }

  async verifyAllEmoticonsRegisterByUser(userId: string) {
    const responseAllCategories = await this.categoriesEmojiRepository.find();
    const responseAllEmojisByDriver = await this.emoticonsByUser(userId);

    const missingCategories = responseAllCategories.filter((_, index) => !responseAllEmojisByDriver[index]);

    const allEmojiRegistered = missingCategories.length === 0;

    return {
      allEmojiRegistered,
      missingCategories
    };
  }
}
