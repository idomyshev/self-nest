import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
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
  getTimeSlots(@Request() req) {
    return this.timeSlotService.getTimeSlots(req.user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createTimeSlot(@Body() body: TimeSlotCreateDto, @Request() req) {
    return this.timeSlotService.createTimeSlot({
      ...(body as any),
      userId: req.user.id,
    });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateTimeSlot(
    @Param() params: IdParamDto,
    @Body() body: TimeSlotCreateDto,
    @Request() req,
  ) {
    return this.timeSlotService.updateTimeSlot(req.user.id, params.id, {
      ...(body as any),
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteTimeSlot(@Param() params: IdParamDto, @Request() req) {
    return await this.timeSlotService.deleteTimeSlot(req.user.id, params.id);
  }
}
