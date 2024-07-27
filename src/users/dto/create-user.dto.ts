import { IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'O campo nome é do tipo caractere' })
  @IsNotEmpty({ message: 'O campo nome é obrigatório' })
  name: string;

  @IsString({ message: 'O campo nome de usuário é do tipo caractere' })
  @IsNotEmpty({ message: 'O campo nome de usuário é obrigatório' })
  username: string;

  @IsString({ message: 'O campo gênero é do tipo caractere' })
  @IsNotEmpty({ message: 'O campo gênero é obrigatório' })
  gender: string;

  @IsOptional()
  @IsString({ message: 'O campo descrição é do tipo caractere' })
  description: string | null;

  @IsString({ message: 'O campo senha é do tipo caractere' })
  @MinLength(6, {
    message: 'O campo senha precisa ter no mínimo 6 caracteres',
  })
  @IsNotEmpty({ message: 'O campo senha é obrigatório' })
  password: string;

  @IsString({ message: 'O campo foto de usuário é do tipo caractere' })
  @IsNotEmpty({ message: 'O campo foto de usuário é obrigatório' })
  photo_profile: string;
}
