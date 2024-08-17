import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.client.findMany();
  }

  async findOne(id: string) {
    return this.prisma.client.findFirst({ where: { id } });
  }
}
