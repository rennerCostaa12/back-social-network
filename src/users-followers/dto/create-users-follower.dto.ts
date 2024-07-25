import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUsersFollowerDto {
  @IsString({ message: 'O campo follower id é do tipo caractere' })
  @IsNotEmpty({ message: 'O campo follower id não pode ser vazio' })
  follower: any;

  @IsString({ message: 'O campo following id do  é do tipo caractere' })
  @IsNotEmpty({ message: 'O campo following id não pode ser vazio' })
  followed: any;
}
