import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../jwt-auth/jwt-auth.guard';
import { FileStorageService } from './file-storage.service';
import { IdParamDto } from '../dto/misc.dto';
import { FileCreateDto } from '../dto/schedule.dto';

@Controller('file-storage')
export class FileStorageController {
  constructor(private readonly fileStorageService: FileStorageService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getFile(@Param() params: IdParamDto, @Request() req) {
    return this.fileStorageService.getFileContent(req.user.id, params.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateFile(
    @Param() params: IdParamDto,
    @Body() body: FileCreateDto,
    @Request() req,
  ) {
    await this.fileStorageService.updateFileContent(
      req.user.id,
      params.id,
      body.data,
    );
  }
}
