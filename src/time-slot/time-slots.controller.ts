import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TimeSlotCreateDto } from '../dto/schedule.dto';
import { IdParamDto } from '../dto/misc.dto';
import { TimeSlotsService } from './time-slots.service';
import { JwtAuthGuard } from '../jwt-auth/jwt-auth.guard';

@Controller('time-slots')
export class TimeSlotsController {
  constructor(private readonly timeSlotService: TimeSlotsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getTimeSlots() {
    return this.timeSlotService.getTimeSlots();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createTimeSlot(@Body() body: TimeSlotCreateDto) {
    // TODO User real user id
    return this.timeSlotService.createTimeSlot({
      ...(body as any),
      userId: 'c80e9b4b-9de6-4403-9c5a-a0ced1bacf0c',
    });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateTimeSlot(@Param() params: IdParamDto, @Body() body: TimeSlotCreateDto) {
    console.log('BODY', body);
    return this.timeSlotService.updateTimeSlot(params.id, {
      ...(body as any),
      userId: 'c80e9b4b-9de6-4403-9c5a-a0ced1bacf0c',
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteTimeSlot(@Param() params: IdParamDto) {
    return await this.timeSlotService.deleteTimeSlot(params.id);
  }
}
