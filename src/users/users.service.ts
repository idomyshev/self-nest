import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return (await this.prisma.user.findMany()).map((item) => {
      delete item.hash;
      return item;
    });
  }

  async findOne(where: any, skipFields?: string[]) {
    try {
      const user = await this.prisma.user.findFirst({ where });

      if (user && skipFields?.length) {
        for (const field of skipFields) {
          delete user[field];
        }
      }

      return user;
    } catch {
      throw new Error("Couldn't get user from database");
    }
  }
}
