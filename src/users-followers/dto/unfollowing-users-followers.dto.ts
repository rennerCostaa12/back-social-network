import { IsNotEmpty, IsString } from 'class-validator';

export class UnfollowingUsersFollowingDto {
  @IsString({ message: 'O campo id de usuário é do tipo caractere' })
  @IsNotEmpty({ message: 'O campo id de usuário é obrigatório' })
  userId: string;
}
