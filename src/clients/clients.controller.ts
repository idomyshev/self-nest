import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { IdParamDto } from '../dto/misc.dto';
import { ClientsService } from './clients.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientService: ClientsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getClients() {
    return this.clientService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getClient(@Param() params: IdParamDto) {
    return await this.clientService.findOne(params.id);
  }
}
