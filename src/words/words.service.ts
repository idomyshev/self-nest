import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Client, Word } from '@prisma/client';

@Injectable()
export class WordsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return (
      await this.prisma.word.findMany({
        include: {
          tags: true,
          translations: true,
        },
      })
    ).map((item) => {
      return item;
    });
  }

  async findOne(userId: string, id: string) {
    return this.prisma.client.findFirst({ where: { userId, id } });
  }

  async createWord(data: Word) {
    return this.prisma.word.create({
      data,
    });
  }
}
