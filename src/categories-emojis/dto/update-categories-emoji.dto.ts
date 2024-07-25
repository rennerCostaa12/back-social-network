import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriesEmojiDto } from './create-categories-emoji.dto';

export class UpdateCategoriesEmojiDto extends PartialType(CreateCategoriesEmojiDto) {}
