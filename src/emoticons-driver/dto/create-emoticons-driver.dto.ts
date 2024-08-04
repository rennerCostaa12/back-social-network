import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateEmoticonsDriverDto {
  @IsString({ message: 'O campo usuário é do tipo caractere' })
  @IsNotEmpty({ message: 'O campo usuário é obrigatório' })
  user: any;

  @IsString({ message: 'O campo categoria é do tipo caractere' })
  @IsNotEmpty({ message: 'O campo categoria de emoticons é obrigatório' })
  category: any;
}
