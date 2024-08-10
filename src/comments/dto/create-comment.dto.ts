import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString({ message: 'O campo usuário é do tipo caractere' })
  @IsNotEmpty({ message: 'O campo usuário é obrigatório' })
  user: any;

  @IsString({ message: 'O campo post é do tipo caractere' })
  @IsNotEmpty({ message: 'O campo post é obrigatório' })
  post: any;
}
