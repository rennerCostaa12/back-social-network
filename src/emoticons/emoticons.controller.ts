import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmoticonsService } from './emoticons.service';
import { CreateEmoticonDto } from './dto/create-emoticon.dto';
import { UpdateEmoticonDto } from './dto/update-emoticon.dto';

@Controller('emoticons')
export class EmoticonsController {
  constructor(private readonly emoticonsService: EmoticonsService) {}

  @Post()
  create(@Body() createEmoticonDto: CreateEmoticonDto) {
    return this.emoticonsService.create(createEmoticonDto);
  }

  @Get()
  findAll() {
    return this.emoticonsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.emoticonsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmoticonDto: UpdateEmoticonDto) {
    return this.emoticonsService.update(+id, updateEmoticonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.emoticonsService.remove(+id);
  }
}
