import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { IdParamDto } from '../dto/misc.dto';
import { ClientsService } from './clients.service';
import { JwtAuthGuard } from '../jwt-auth/jwt-auth.guard';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientService: ClientsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getClients() {
    return this.clientService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getClient(@Param() params: IdParamDto, @Request() req) {
    return await this.clientService.findOne(params.id);
  }
}
