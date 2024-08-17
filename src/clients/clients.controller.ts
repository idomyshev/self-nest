import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../conception/guard';
import { IdParamDto } from '../dto/misc.dto';
import { ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientService: ClientsService) {}

  @Get()
  @UseGuards(AuthGuard)
  getClients() {
    return this.clientService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getClient(@Param() params: IdParamDto) {
    return await this.clientService.findOne(params.id);
  }
}
