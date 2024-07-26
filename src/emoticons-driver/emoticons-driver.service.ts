import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEmoticonsDriverDto } from './dto/create-emoticons-driver.dto';
import { UpdateEmoticonsDriverDto } from './dto/update-emoticons-driver.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EmoticonsDriver } from './entities/emoticons-driver.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CategoriesEmoji } from 'src/categories-emojis/entities/categories-emoji.entity';

@Injectable()
export class EmoticonsDriverService {
  constructor(
    @InjectRepository(EmoticonsDriver)
    private emoticonsDriverRepository: Repository<EmoticonsDriver>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(CategoriesEmoji)
    private categoriesEmojiRepository: Repository<CategoriesEmoji>,
  ) {}

  async create(createEmoticonsDriverDto: CreateEmoticonsDriverDto) {
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

    const emoticonsDriver = this.emoticonsDriverRepository.create(
      createEmoticonsDriverDto,
    );

    return this.emoticonsDriverRepository.save(emoticonsDriver);
  }

  async findEmoticonsByUser(id: string) {
    const userFinded = await this.usersRepository.findOneBy({ id });

    if (!userFinded) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    const emoticonsFinded = await this.emoticonsDriverRepository
      .createQueryBuilder('emoticonsDriver')
      .innerJoinAndSelect('emoticonsDriver.category', 'category')
      .where('emoticonsDriver.userId = :id', { id })
      .getMany();

    return emoticonsFinded;
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
}
