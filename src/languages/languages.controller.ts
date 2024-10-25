import { Controller, Get, UseGuards } from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { JwtAuthGuard } from '../jwt-auth/jwt-auth.guard';

@Controller('languages')
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getLanguages() {
    return this.languagesService.findAll();
  }
}
