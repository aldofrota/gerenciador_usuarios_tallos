import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { CreateUserDto, LoginUserDto } from '../models/user.model';

jest.mock('../services/app.service');

describe('UserController', () => {
  let appController: UserController;
  let appService: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    appController = module.get<UserController>(UserController);
    appService = module.get<UserService>(UserService);
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
