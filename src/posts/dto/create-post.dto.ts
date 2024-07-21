import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsString({ message: 'O campo imagem é do tipo caractere' })
  @IsNotEmpty({ message: 'O campo imagem é obrigatório' })
  picture: any;

  @IsNumber()
  @IsNotEmpty({ message: 'O campo id city é obrigatório' })
  city_id: any;

  @IsOptional()
  @IsString({ message: 'O campo tags é do tipo caractere' })
  tags: any;

  @IsString({ message: 'O campo usuário é do tipo caractere' })
  @IsNotEmpty({ message: 'O campo usuário é obrigatório' })
  user: any;
}
