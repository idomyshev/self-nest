import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { IdParamDto } from '../dto/misc.dto';
import { ClientsService } from './clients.service';
import { JwtAuthGuard } from '../jwt-auth/jwt-auth.guard';
import { ClientCreateDto, TimeSlotCreateDto } from '../dto/schedule.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientService: ClientsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getClients(@Request() req) {
    return this.clientService.findAll(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getClient(@Param() params: IdParamDto, @Request() req) {
    return await this.clientService.findOne(req.user.id, params.id);
  }
  @Post()
  @UseGuards(JwtAuthGuard)
  createClient(@Body() body: ClientCreateDto, @Request() req) {
    return this.clientService.createClient({
      ...(body as any),
      userId: req.user.id,
    });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateClient(
    @Param() params: IdParamDto,
    @Body() body: ClientCreateDto,
    @Request() req,
  ) {
    return this.clientService.updateClient(req.user.id, params.id, {
      ...(body as any),
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteClient(@Param() params: IdParamDto, @Request() req) {
    return await this.clientService.deleteClient(req.user.id, params.id);
  }
}
