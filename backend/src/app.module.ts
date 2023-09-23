import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { WebsocketGateway } from './websocket.gateway';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongodb/tallos-users'),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],

  controllers: [AppController],
  providers: [AppService, WebsocketGateway],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly appService: AppService) {}

  async onModuleInit() {
    // Inicialize o banco de dados com um usuário padrão
    const adminUser = {
      name: 'Admin',
      email: 'admin@admin',
      password: 'admin',
      level: 'admin',
    };
    const existingAdmin = await this.appService.findUserByEmail(
      adminUser.email,
    );
    if (!existingAdmin) {
      await this.appService.create(adminUser);
      console.log('Usuário admin padrão criado.');
    }
  }
}
