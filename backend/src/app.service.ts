import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './models/user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findUserByEmail(email: string) {
    return await this.userModel.findOne({ email }).exec();
  }

  async create(user: User): Promise<any> {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 5);
      user.password = hashedPassword;
      const createdUser = new this.userModel(user);
      await createdUser.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpException('E-mail já cadastrado', HttpStatus.BAD_REQUEST);
      } else {
        console.log(error);
        throw new HttpException('Erro interno', 500);
      }
    }
  }
}
