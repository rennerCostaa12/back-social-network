import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { EmoticonsDriverService } from './emoticons-driver.service';
import { CreateEmoticonsDriverDto } from './dto/create-emoticons-driver.dto';
import { UpdateEmoticonsDriverDto } from './dto/update-emoticons-driver.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('emoticons-driver')
export class EmoticonsDriverController {
  constructor(
    private readonly emoticonsDriverService: EmoticonsDriverService,
  ) {}

  @Post()
  create(@Body() createEmoticonsDriverDto: CreateEmoticonsDriverDto) {
    return this.emoticonsDriverService.create(createEmoticonsDriverDto);
  }

  @Get('find-emoticons-by-user/:id')
  findAll(@Param('id', ParseUUIDPipe) id: string) {
    return this.emoticonsDriverService.findEmoticonsByUser(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.emoticonsDriverService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmoticonsDriverDto: UpdateEmoticonsDriverDto,
  ) {
    return this.emoticonsDriverService.update(+id, updateEmoticonsDriverDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.emoticonsDriverService.remove(+id);
  }
}
