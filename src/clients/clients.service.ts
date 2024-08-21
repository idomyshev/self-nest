import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Client, Prisma } from '@prisma/client';

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
    try {
      return await this.prisma.client.create({
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('User with this email already exists');
        }

        throw error;
      }
    }
  }

  async updateClient(userId: string, id: string, data: Client) {
    try {
      return await this.prisma.client.update({
        where: {
          userId,
          id,
        },
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException();
        }

        throw error;
      }
    }
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
