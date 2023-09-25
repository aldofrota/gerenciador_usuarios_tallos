import { Body, Controller, Get, HttpException, Post } from '@nestjs/common';
import { AppService } from './app.service';
import {
  AuthResponseDto,
  CreateUserDto,
  LoginUserDto,
  User,
} from './models/user.model';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('/users')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar um novo usuário' })
  @ApiBody({
    type: CreateUserDto,
    description: 'Corpo da requisição para criar um novo usuário',
  })
  @ApiResponse({ status: 201, description: 'Usuário cadastrado com sucesso' })
  @ApiResponse({ status: 400, description: 'E-mail já cadastrado no sistema' })
  async registerUsers(@Body() body: User): Promise<{ message: string }> {
    try {
      await this.appService.create(body);
      return { message: 'Usuário cadastrado' };
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @Post('/auth')
  @ApiOperation({ summary: 'Autenticar usuário' })
  @ApiBody({
    type: LoginUserDto,
    description: 'Corpo da requisição se autenticação',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário autenticado com sucesso',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async authUser(@Body() body: User) {
    try {
      const user = await this.appService.auth(body);
      return user;
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }
}
