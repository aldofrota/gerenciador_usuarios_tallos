import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

function generateRandomEmail(
  prefix: string,
  domain: string,
  suffixLength: number = 4,
): string {
  const randomString = Math.random()
    .toString(36)
    .substring(2, 2 + suffixLength);
  return `${prefix}${randomString}@${domain}`;
}

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Registrar novo usuário', () => {
    const user = {
      name: 'John Doe',
      email: generateRandomEmail('jhon', 'example.com'),
      password: 'password123',
    };

    return request(app.getHttpServer())
      .post('/users')
      .send(user)
      .expect(201) // Expecting a successful creation (HTTP status code 201)
      .expect((res) => {
        expect(res.body.message);
      });
  });

  it('Autenticar na Aplicação', () => {
    const user = {
      email: 'admin@admin',
      password: 'admin',
    };

    return request(app.getHttpServer())
      .post('/users/auth')
      .send(user)
      .expect(201) // Esperando uma criação bem-sucedida (HTTP status code 201)
      .expect((res) => {
        expect(res.body.name);
        expect(res.body.email);
        expect(res.body.token);
      });
  });
});
