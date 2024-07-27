import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto{
    @IsString({ message: "O campo nome de usuário é do tipo caractere" })
    @IsNotEmpty({ message: "O Campo nome de usuário é obrigatório" })
    username: string;

    @IsString({ message: "O campo senha é do tipo caractere" })
    @IsNotEmpty({ message: "O Campo senha é obrigatório" })
    password: string;
}