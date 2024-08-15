import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateReactionDto {
  @IsNumber()
  @IsNotEmpty({ message: 'O campo emoticons do motorista é obrigatório' })
  emoticons_driver: any;

  @IsString({ message: 'O campo post é do tipo caractere' })
  @IsNotEmpty({ message: 'O campo post é obrigatório' })
  post: any;
}
