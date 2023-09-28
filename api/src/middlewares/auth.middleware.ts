import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { AppService } from '../services/app.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private appService: AppService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Verificar se o token JWT está presente no cabeçalho da requisição
    let token = req.headers.authorization;
    if (!token) {
      throw new UnauthorizedException('Token JWT não fornecido.');
    }
    // Validar o token JWT
    try {
      token = token.split(' ')[1];
      const decodedToken = jwt.verify(token, 'tallos-users');
      req.body.tokenPayload = decodedToken; // Adiciona o payload do token ao corpo da requisição
      next();
    } catch (error) {
      throw new UnauthorizedException('Token JWT inválido.');
    }
  }
}
