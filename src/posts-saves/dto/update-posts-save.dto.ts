import { PartialType } from '@nestjs/mapped-types';
import { CreatePostsSaveDto } from './create-posts-save.dto';

export class UpdatePostsSaveDto extends PartialType(CreatePostsSaveDto) {}
