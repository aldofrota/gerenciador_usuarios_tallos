import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './models/user.model';

const appServiceMock = {
  create: jest.fn(),
  auth: jest.fn(),
};

const user: User = {
  name: 'João Silva',
  email: 'joao@example.com',
  password: 'senha123',
};

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: appServiceMock,
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
  });

  describe('registerUsers', () => {
    it('Registrar um novo usuário', async () => {
      jest.spyOn(appServiceMock, 'create').mockResolvedValueOnce(User);

      const result = await appController.registerUsers(user);
      expect(result).toEqual({ message: 'Usuário cadastrado' });
    });

    it('Erro ao registrar novo usuário', async () => {
      const errorMessage = 'Erro ao cadastrar usuário';
      jest.spyOn(appServiceMock, 'create').mockRejectedValueOnce({
        response: errorMessage,
        status: 400,
      });

      await expect(appController.registerUsers(user)).rejects.toThrowError(
        errorMessage,
      );
    });

    // ... Other test cases ...
  });
});
