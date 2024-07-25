import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoriesEmojiDto } from './dto/create-categories-emoji.dto';
import { UpdateCategoriesEmojiDto } from './dto/update-categories-emoji.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesEmoji } from './entities/categories-emoji.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesEmojisService {
  constructor(
    @InjectRepository(CategoriesEmoji)
    private categoriesEmojisRepository: Repository<CategoriesEmoji>,
  ) {}

  async create(createCategoriesEmojiDto: CreateCategoriesEmojiDto) {
    const categoryEmojiFinded = await this.categoriesEmojisRepository.findOneBy(
      { name: createCategoriesEmojiDto.name },
    );

    
    if (categoryEmojiFinded) {
      throw new HttpException(
        'Já existe uma categoria com este nome. Por favor escolha outro!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const categoryEmoji =
      this.categoriesEmojisRepository.create(createCategoriesEmojiDto);

    return this.categoriesEmojisRepository.save(categoryEmoji);
  }

  findAll() {
    return this.categoriesEmojisRepository.find();
  }

  async findOne(id: number) {
    const categoryEmojiFinded = await this.categoriesEmojisRepository.findOneBy(
      { id },
    );

    if (!categoryEmojiFinded) {
      throw new HttpException(
        'Categoria de emoji não encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    return categoryEmojiFinded;
  }

  async update(id: number, updateCategoriesEmojiDto: UpdateCategoriesEmojiDto) {
    const categoryEmojiFinded = await this.categoriesEmojisRepository.findOneBy(
      { id },
    );

    if (!categoryEmojiFinded) {
      throw new HttpException(
        'Categoria de emoji não encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    return this.categoriesEmojisRepository.update(id, {
      ...updateCategoriesEmojiDto,
      updated_at: new Date(),
    });
  }

  remove(id: number) {
    return this.categoriesEmojisRepository.delete(id);
  }
}
