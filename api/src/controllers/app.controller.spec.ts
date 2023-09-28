import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from '../services/app.service';
import { CreateUserDto, LoginUserDto } from '../models/user.model';

jest.mock('../services/app.service');

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const users: any[] = [
        { id: '1', name: 'User 1', email: 'user1@example.com' },
      ];
      jest.spyOn(appService, 'findAll').mockResolvedValue(users);

      const result = await appController.getUsers();

      expect(result).toEqual(users);
    });
  });

  describe('registerUsers', () => {
    it('should register a new user', async () => {
      const newUser: CreateUserDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };
      jest.spyOn(appService, 'create').mockResolvedValue(newUser);

      const result = await appController.registerUsers(newUser);

      expect(result).toEqual({ message: 'Usuário cadastrado' });
    });
  });

  describe('authUser', () => {
    it('should authenticate a user', async () => {
      const loginUser: LoginUserDto = {
        email: 'john.doe@example.com',
        password: 'password123',
      };
      const authResponse = { token: 'fakeToken' };
      jest.spyOn(appService, 'auth').mockResolvedValue(authResponse);

      const result = await appController.authUser(loginUser);

      expect(result).toEqual(authResponse);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const userId = '1';
      const updatedUser = {
        role: 'user',
      };
      jest.spyOn(appService, 'update').mockResolvedValue(updatedUser);

      const result = await appController.updateUser(userId, updatedUser);

      expect(result).toEqual(updatedUser);
    });
  });

  describe('removeUser', () => {
    it('should remove a user', async () => {
      const userId = '1';
      jest.spyOn(appService, 'delete').mockResolvedValue(userId);

      await expect(appController.removeUser(userId)).resolves.not.toThrow();
    });
  });
});
