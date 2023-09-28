import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { WebsocketGateway } from './websockets/websocket.gateway';
import { AuthMiddleware } from './middlewares/auth.middleware';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/tallos-users'),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],

  controllers: [AppController],
  providers: [AppService, WebsocketGateway],
})
export class AppModule implements OnModuleInit, NestModule {
  constructor(private readonly appService: AppService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/users', method: RequestMethod.GET },
        { path: '/users', method: RequestMethod.PUT },
        { path: '/users', method: RequestMethod.DELETE },
      );
  }

  async onModuleInit() {
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
