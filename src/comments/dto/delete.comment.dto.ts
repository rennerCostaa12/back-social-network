import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteCommentDto {
    @IsString({ message: "O campo usuário é do tipo caractere" })
    @IsNotEmpty({ message: "O campo usuário é obrigatório" })
    user: any;
}