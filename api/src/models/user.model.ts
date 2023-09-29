import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;
export type Permissions = {
  [key: string]: boolean; // As chaves são as permissões e os valores indicam se a permissão está habilitada ou não.
};

@Schema()
export class User {
  @Prop({ required: true })
  name?: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'user' })
  role?: string;

  @Prop({
    default: {
      register: false,
      remove: false,
      update_user: false,
    },
    type: Object,
  })
  permissions?: Permissions;
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
  readonly role: string;
}

export class AuthResponseDto {
  @ApiProperty({ description: 'Nome do usuário' })
  readonly name: string;

  @ApiProperty({ description: 'Endereço de e-mail do usuário' })
  readonly email: string;

  @ApiProperty({ description: 'Token JWT gerado após a autenticação' })
  readonly token: string;
}
