import { PartialType } from '@nestjs/mapped-types';
import { CreateEmoticonDto } from './create-emoticon.dto';

export class UpdateEmoticonDto extends PartialType(CreateEmoticonDto) {}
