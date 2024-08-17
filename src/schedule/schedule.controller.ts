import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../conception/guard';
import { ScheduleService } from './schedule.service';
import { IdParamDto } from '../dto/misc.dto';
import { TimeSlotCreateDto } from '../dto/schedule.dto';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get('timeSlots')
  @UseGuards(AuthGuard)
  getTimeSlots() {
    return this.scheduleService.findAllTimeSlots();
  }

  @Post('timeSlots')
  @UseGuards(AuthGuard)
  createTimeSlot(@Body() body: TimeSlotCreateDto) {
    console.log('BODY', body);
    return this.scheduleService.createTimeSlot({
      ...(body as any),
      userId: 'c80e9b4b-9de6-4403-9c5a-a0ced1bacf0c',
    });
  }

  @Delete('timeSlots/:id')
  @UseGuards(AuthGuard)
  async deleteTimeSlot(@Param() params: IdParamDto) {
    return await this.scheduleService.deleteTimeSlot(params.id);
  }
}
