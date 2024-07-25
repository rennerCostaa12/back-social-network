import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriesEmojisService } from './categories-emojis.service';
import { CreateCategoriesEmojiDto } from './dto/create-categories-emoji.dto';
import { UpdateCategoriesEmojiDto } from './dto/update-categories-emoji.dto';

@Controller('categories-emojis')
export class CategoriesEmojisController {
  constructor(private readonly categoriesEmojisService: CategoriesEmojisService) {}

  @Post()
  create(@Body() createCategoriesEmojiDto: CreateCategoriesEmojiDto) {
    return this.categoriesEmojisService.create(createCategoriesEmojiDto);
  }

  @Get()
  findAll() {
    return this.categoriesEmojisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesEmojisService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoriesEmojiDto: UpdateCategoriesEmojiDto) {
    return this.categoriesEmojisService.update(+id, updateCategoriesEmojiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesEmojisService.remove(+id);
  }
}
