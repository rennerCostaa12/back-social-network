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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { EmoticonsDriverService } from './emoticons-driver.service';
import { CreateEmoticonsDriverDto } from './dto/create-emoticons-driver.dto';
import { UpdateEmoticonsDriverDto } from './dto/update-emoticons-driver.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('emoticons-driver')
export class EmoticonsDriverController {
  constructor(
    private readonly emoticonsDriverService: EmoticonsDriverService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('img_driver'))
  create(
    @Body() createEmoticonsDriverDto: CreateEmoticonsDriverDto,
    @UploadedFile() img_driver: Express.Multer.File,
  ) {
    return this.emoticonsDriverService.create(
      createEmoticonsDriverDto,
      img_driver,
    );
  }

  @Get('find-emoticons-by-user/:id')
  findAll(@Param('id', ParseUUIDPipe) id: string) {
    return this.emoticonsDriverService.findEmoticonsByUser(id);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.emoticonsDriverService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmoticonsDriverDto: UpdateEmoticonsDriverDto,
  ) {
    return this.emoticonsDriverService.update(+id, updateEmoticonsDriverDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.emoticonsDriverService.remove(+id);
  }

  @Get('search-emoticons-by-driver/:id')
  verifyAllEmoticonsRegisterByUser(@Param('id', ParseUUIDPipe) idUser: string) {
    return this.emoticonsDriverService.verifyAllEmoticonsRegisterByUser(idUser);
  }
}
