import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Client } from '@prisma/client';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.client.findMany({ where: { userId } });
  }

  async findOne(userId: string, id: string) {
    return this.prisma.client.findFirst({ where: { userId, id } });
  }

  async createClient(data: Client) {
    return this.prisma.client.create({
      data,
    });
  }

  async updateClient(userId: string, id: string, data: Client) {
    return this.prisma.client.update({
      where: {
        userId,
        id,
      },
      data,
    });
  }

  async deleteClient(userId: string, id: string) {
    const deletedItem = await this.prisma.client.delete({
      where: {
        userId,
        id,
      },
    });

    return !!deletedItem;
  }
}
