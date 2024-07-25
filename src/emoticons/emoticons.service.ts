import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEmoticonDto } from './dto/create-emoticon.dto';
import { UpdateEmoticonDto } from './dto/update-emoticon.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Emoticon } from './entities/emoticon.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmoticonsService {
  constructor(
    @InjectRepository(Emoticon)
    private emoticonsRepository: Repository<Emoticon>,
  ) {}

  async create(createEmoticonDto: CreateEmoticonDto) {
    const findEmoticonsByName = await this.emoticonsRepository.findOneBy({
      order: createEmoticonDto.order,
    });

    if (findEmoticonsByName) {
      throw new HttpException(
        'Não é possível cadastrar emoticons com ordem iguais!',
        HttpStatus.BAD_REQUEST,
      );
    }
    const emoticon = this.emoticonsRepository.create(createEmoticonDto);

    return this.emoticonsRepository.save(emoticon);
  }

  findAll() {
    return this.emoticonsRepository.find({
      order: {
        order: 'ASC',
      },
      relations: {
        categories_emoji: true,
      },
    });
  }

  async findOne(id: number) {
    const emoticonFinded = await this.emoticonsRepository.findOne({
      relations: {
        categories_emoji: true,
      },
      where: {
        id,
      },
    });

    if (!emoticonFinded) {
      throw new HttpException('Emoticon não encontrado', HttpStatus.NOT_FOUND);
    }

    return emoticonFinded;
  }

  async update(id: number, updateEmoticonDto: UpdateEmoticonDto) {
    const emoticonFinded = await this.emoticonsRepository.findOneBy({ id });

    if (!emoticonFinded) {
      throw new HttpException('Emoticon não encontrado', HttpStatus.NOT_FOUND);
    }

    const findEmoticonsByOrder = await this.emoticonsRepository.findOneBy({
      order: updateEmoticonDto.order,
    });

    if (findEmoticonsByOrder && findEmoticonsByOrder.id !== id) {
      throw new HttpException(
        'Existem emoticons com mesma ordem. Por favor, mude para uma ordem que não esteja sendo usada!',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.emoticonsRepository.update(id, {
      ...updateEmoticonDto,
      updated_at: new Date(),
    });
  }

  remove(id: number) {
    return this.emoticonsRepository.delete(id);
  }
}
