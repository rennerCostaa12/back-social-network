import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateEmoticonDto {
  @IsString({ message: 'O campo imagem é do tipo caractere' })
  @IsNotEmpty({ message: 'O campo imagem é obrigatório' })
  image: string;

  @IsString({ message: 'O campo descrição é do tipo caractere' })
  @IsNotEmpty({ message: 'O campo descrição é obrigatório' })
  description: string;

  @IsNumber()
  @IsNotEmpty({ message: 'O campo ordem é obrigatório' })
  order: number;

  @IsNumber()
  @IsNotEmpty({ message: 'O campo imagem é obrigatório' })
  categories_emoji: any;
}
