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
  Headers
} from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { UpdateReactionDto } from './dto/update-reaction.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post()
  create(@Body() createReactionDto: CreateReactionDto, @Headers() headers: any) {
    const userId = headers.id_user;
    return this.reactionsService.create(createReactionDto, userId);
  }

  @Get()
  findAll() {
    return this.reactionsService.findAll();
  }

  @Get('find-reactions-by-post/:id')
  findReactionsByPost(@Param('id', ParseUUIDPipe) id: string) {
    return this.reactionsService.findReactionsByPost(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.reactionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReactionDto: UpdateReactionDto,
    @Headers() headers: any
  ) {
    const userId = headers.id_user;
    return this.reactionsService.update(id, updateReactionDto, userId);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Headers() headers: any) {
    const userId = headers.id_user;
    return this.reactionsService.remove(id, userId);
  }
}
