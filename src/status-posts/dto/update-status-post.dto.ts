import { PartialType } from '@nestjs/mapped-types';
import { CreateStatusPostDto } from './create-status-post.dto';

export class UpdateStatusPostDto extends PartialType(CreateStatusPostDto) {}
