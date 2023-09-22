import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { User } from './models/user.model';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongodb/users'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
