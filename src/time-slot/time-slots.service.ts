import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TimeSlot } from '@prisma/client';

@Injectable()
export class TimeSlotsService {
  constructor(private readonly prisma: PrismaService) {}

  async getTimeSlots(userId: string) {
    return this.prisma.timeSlot.findMany({
      where: { userId },
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
      include: { client: true },
    });
  }

  async createTimeSlot(data: TimeSlot) {
    return this.prisma.timeSlot.create({
      data,
    });
  }

  async updateTimeSlot(userId: string, id: string, data: TimeSlot) {
    return this.prisma.timeSlot.update({
      where: {
        userId,
        id,
      },
      data,
    });
  }

  async deleteTimeSlot(userId: string, id: string) {
    const deletedItem = await this.prisma.timeSlot.delete({
      where: {
        userId,
        id,
      },
    });

    return !!deletedItem;
  }
}
