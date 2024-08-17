import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll() {
    return this.prisma.user.findMany();
  }

  // create(dto: CreateFlowersDto) {
  //   return this.prisma.users;
  // }
}
