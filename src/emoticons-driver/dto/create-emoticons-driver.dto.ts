import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateEmoticonsDriverDto {
  @IsString({ message: 'O campo imagem é do tipo caractere' })
  @IsNotEmpty({ message: 'O campo imagem é obrigatório' })
  image: string;

  @IsString({ message: 'O campo usuário é do tipo caractere' })
  @IsNotEmpty({ message: 'O campo usuário é obrigatório' })
  user: any;

  @IsNumber()
  @IsNotEmpty({ message: 'O campo categoria de emoticons é obrigatório' })
  category: any;
}
