import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { StatusPostsService } from './status-posts.service';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('status-posts')
export class StatusPostsController {
  constructor(private readonly statusPostsService: StatusPostsService) {}

  // @Post()
  // create(@Body() createStatusPostDto: CreateStatusPostDto) {
  //   return this.statusPostsService.create(createStatusPostDto);
  // }

  @Get()
  findAll() {
    return this.statusPostsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.statusPostsService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateStatusPostDto: UpdateStatusPostDto) {
  //   return this.statusPostsService.update(+id, updateStatusPostDto);
  // }
}
