import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
  RequestMethod,
} from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './models/user.schema';
import { WebsocketGateway } from './websockets/websocket.gateway';
import { AuthMiddleware } from './middlewares/auth.middleware';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/tallos-users'),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],

  controllers: [UserController],
  providers: [UserService, WebsocketGateway],
})
export class AppModule implements OnModuleInit, NestModule {
  constructor(private readonly appService: UserService) {}

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
      permissions: {
        register: true,
        remove: true,
        update_user: true,
      },
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
