import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { User, UserDocument } from '../models/user.model';
import { WebsocketGateway } from '../websockets/websocket.gateway';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private websocketGateway: WebsocketGateway,
  ) {}

  async findAll() {
    return await this.userModel.find().exec();
  }

  async findUserByEmail(email: string) {
    return await this.userModel.findOne({ email }).exec();
  }

  async create(user: User): Promise<any> {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 5);
      user.password = hashedPassword;
      const createdUser = new this.userModel(user);

      await createdUser.save();

      const new_user = {
        title: 'Novo Usuário',
        message: `${createdUser.name} foi cadastrado na plataforma.`,
        time: moment(),
        email: createdUser.email,
      };
      this.websocketGateway.server.emit('new-user', new_user);
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpException('E-mail já cadastrado', HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException('Erro interno', 500);
      }
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const deletedUser = await this.userModel.findById(id);

      if (!deletedUser) {
        throw new HttpException('Usuário não localizado', HttpStatus.NOT_FOUND);
      }
      await deletedUser.deleteOne();

      const socket_client = this.websocketGateway.users.find(
        (user) => user.email === deletedUser.email,
      );
      if (socket_client) {
        this.websocketGateway.server
          .to(socket_client.id_socket)
          .emit('deleted-user-on');
      }

      const deleted_user = {
        title: 'Usuário Excluido',
        message: `${deletedUser.name} foi excluido da plataforma.`,
        time: moment(),
        email: deletedUser.email,
      };
      setTimeout(() => {
        this.websocketGateway.server.emit('deleted-user', deleted_user);
      }, 500);
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpException('E-mail já cadastrado', HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException('Erro interno', 500);
      }
    }
  }

  async auth(user: User): Promise<any> {
    const userData = await this.userModel.findOne({ email: user.email }).exec();
    if (userData) {
      const check = await this.checkPassword(user.password, userData.password);
      if (check) {
        const user = this.websocketGateway.users.filter(
          (u) => u.email === userData.email,
        );

        if (!user[0]) {
          const token = this.generateJwtToken(userData.email);
          return {
            name: userData.name,
            email: userData.email,
            token,
            role: userData.role,
            permissions: userData.permissions,
          };
        } else {
          throw new HttpException(
            'Usuário já logado em outra sessão',
            HttpStatus.UNAUTHORIZED,
          );
        }
      } else {
        throw new HttpException(
          'Credenciais inválidas',
          HttpStatus.UNAUTHORIZED,
        );
      }
    } else {
      throw new HttpException('Credenciais inválidas', HttpStatus.UNAUTHORIZED);
    }
  }

  async update(id: string, data: any): Promise<any> {
    const userData = await this.userModel.findById(id);
    try {
      if (userData) {
        userData.role = data.role;
        userData.permissions = data.permissions;
        await userData.save();

        const socket_client = this.websocketGateway.users.find(
          (user) => user.email === data.email,
        );
        if (socket_client) {
          this.websocketGateway.users.map((user) => {
            if (user.email === data.email) user.role = data.role;
            return user;
          });

          this.websocketGateway.server
            .to(socket_client.id_socket)
            .emit('update-role-user-on', {
              role: userData.role,
              permissions: userData.permissions,
            });
        }
        this.websocketGateway.server.emit(
          'update-role',
          this.websocketGateway.users,
        );
      } else {
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      console.error(error.message);
      throw new HttpException('Erro ao atualizar usuário', 500);
    }
  }

  async checkPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  generateJwtToken(email: string): string {
    const token = jwt.sign({ usuario: email }, 'tallos-users', {
      expiresIn: '9h',
    });
    return token;
  }
}
