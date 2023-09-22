import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/users')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getUsers() {
    return this.appService.findAll();
  }

  @Post()
  registerUsers(@Body() body: any) {
    console.log(body);
    return this.appService.getHello();
  }
}
