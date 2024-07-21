import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateStatusPostDto {
  @IsString({ message: 'O campo nome é do tipo caractere' })
  @IsNotEmpty({ message: 'O campo nome é obrigatório' })
  name: string;

  @IsOptional()
  @IsString({ message: 'O campo descrição é do tipo caractere' })
  description: string | null;
}
