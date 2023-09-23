import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API Sistema Gerenciador de Usuários.')
    .setDescription('Documentação da API do Sistema Gerenciador de Usuários.')
    .setVersion('1.0')
    .addTag('users') // Adicione tags conforme necessário
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  app.enableCors();
  await app.listen(3000);
}
bootstrap();
