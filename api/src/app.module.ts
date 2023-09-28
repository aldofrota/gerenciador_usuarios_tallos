import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { WebsocketGateway } from './websocket.gateway';
import { AuthMiddleware } from './auth.middleware';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongodb/tallos-users'),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],

  controllers: [AppController],
  providers: [AppService, WebsocketGateway],
})
export class AppModule implements OnModuleInit, NestModule {
  constructor(private readonly appService: AppService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: '/users', method: RequestMethod.GET },
      { path: '/users', method: RequestMethod.PUT },
      { path: '/users', method: RequestMethod.DELETE },
      // Adicione aqui outras rotas e métodos que deseja aplicar o middleware
    );
  }

  async onModuleInit() {
    // Inicialize o banco de dados com um usuário padrão
    const adminUser = {
      name: 'Admin',
      email: 'admin@admin',
      password: 'admin1234',
      role: 'admin',
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
