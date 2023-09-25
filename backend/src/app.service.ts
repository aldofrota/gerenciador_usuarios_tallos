import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { User, UserDocument } from './models/user.model';
import { WebsocketGateway } from './websocket.gateway';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private websocketGateway: WebsocketGateway,
  ) {}

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
        message: `${createdUser.name} realizou seu cadastro na plataforma.`,
        time: moment(),
        email: createdUser.email,
      };
      this.websocketGateway.server.emit('new-user', new_user);
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpException('E-mail já cadastrado', HttpStatus.BAD_REQUEST);
      } else {
        console.log(error);
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
            level: userData.level,
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

  verifyJwtToken(token: string) {
    let decode: any = '';
    jwt.verify(token, 'tallos-users', (err, decoded) => {
      if (err) {
        console.error('Erro ao verificar o token:', err.message);
      } else {
        decode = decoded;
      }
    });
    return decode;
  }
}
