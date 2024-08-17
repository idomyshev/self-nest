import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return (await this.prisma.user.findMany()).map((item) => {
      delete item.hash;
      return item;
    });
  }

  async findOne(id: string) {
    try {
      const user = await this.prisma.user.findFirst({ where: { id } });

      if (user) {
        delete user.hash;
      }

      return user;
    } catch {
      throw new Error("Couldn't get user from database");
    }
  }

  // TODO
  // create(dto: CreateFlowersDto) {
  //   return this.prisma.users;
  // }
}
