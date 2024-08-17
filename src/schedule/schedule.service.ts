import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TimeSlot } from '@prisma/client';

@Injectable()
export class ScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllTimeSlots() {
    return this.prisma.timeSlot.findMany({
      // TODO
      //where: { userId: auth.user.id },
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
      include: { client: true },
    });
  }

  async createTimeSlot(data: TimeSlot) {
    return this.prisma.timeSlot.create({
      // TODO add userId: auth.user.id to data.
      data,
    });
  }

  async deleteTimeSlot(id: string) {
    const deletedItem = await this.prisma.timeSlot.delete({
      where: {
        id,
      },
    });

    return !!deletedItem;
  }
}
