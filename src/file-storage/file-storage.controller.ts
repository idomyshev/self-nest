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
import { FileCreateDto, FileTypeParamDto, IdParamDto } from '../dto/misc.dto';

@Controller('file-storage')
export class FileStorageController {
  constructor(private readonly fileStorageService: FileStorageService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getFile(@Param() params: IdParamDto, @Request() req) {
    return this.fileStorageService.getFileContent(req.user.id, params.id);
  }

  @Get('auth-user-file-by-type/:type')
  @UseGuards(JwtAuthGuard)
  getAuthUserFileByType(@Param() params: FileTypeParamDto, @Request() req) {
    return this.fileStorageService.getAuthUserFileByType(
      req.user.id,
      params.type,
    );
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
