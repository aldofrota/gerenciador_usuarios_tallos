import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name?: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'user' })
  level?: string;
}

export const UserModel = SchemaFactory.createForClass(User);

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Nome do usuário' })
  readonly name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Endereço de e-mail do usuário',
  })
  readonly email: string;

  @ApiProperty({
    example: 'mypassword',
    description: 'Senha do usuário',
  })
  readonly password: string;
}

export class LoginUserDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Endereço de e-mail do usuário',
  })
  readonly email: string;

  @ApiProperty({
    example: 'mypassword',
    description: 'Senha do usuário',
  })
  readonly password: string;
}

export class UpdateUserDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Endereço de e-mail do usuário',
  })
  readonly email: string;

  @ApiProperty({
    example: 'user',
    description: 'Permissão nova do usuário',
  })
  readonly level: string;
}

export class AuthResponseDto {
  @ApiProperty({ description: 'Nome do usuário' })
  readonly name: string;

  @ApiProperty({ description: 'Endereço de e-mail do usuário' })
  readonly email: string;

  @ApiProperty({ description: 'Token JWT gerado após a autenticação' })
  readonly token: string;
}
