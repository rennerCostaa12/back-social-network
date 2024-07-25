import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoriesEmojiDto {
  @IsString({ message: 'O campo nome é do tipo caractere' })
  @IsNotEmpty({ message: 'O campo nome é obrigatório' })
  name: string;

  @IsOptional()
  @IsString({ message: 'O campo descriçãoo é do tipo caractere' })
  description: string | null;

  @IsString()
  @IsNotEmpty({ message: 'O campo imagem é do tipo caractere' })
  image: string;
}
