import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { IdParamDto } from '../dto/misc.dto';
import { ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientService: ClientsService) {}

  @Get()
  getClients() {
    return this.clientService.findAll();
  }

  @Get(':id')
  async getClient(@Param() params: IdParamDto) {
    return await this.clientService.findOne(params.id);
  }
}
