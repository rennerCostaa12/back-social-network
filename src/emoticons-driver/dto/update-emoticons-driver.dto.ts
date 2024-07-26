import { PartialType } from '@nestjs/mapped-types';
import { CreateEmoticonsDriverDto } from './create-emoticons-driver.dto';

export class UpdateEmoticonsDriverDto extends PartialType(CreateEmoticonsDriverDto) {}
