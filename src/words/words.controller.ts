import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../jwt-auth/jwt-auth.guard';
import { WordsService } from './words.service';
import { IdParamDto, WordCreateDto } from '../dto/misc.dto';

@Controller('words')
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getWords() {
    return this.wordsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getClient(@Param() params: IdParamDto, @Request() req) {
    return await this.wordsService.findOne(req.user.id, params.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createClient(@Body() body: WordCreateDto, @Request() req) {
    return this.wordsService.createWord({
      ...(body as any),
      userId: req.user.id,
    });
  }
}
