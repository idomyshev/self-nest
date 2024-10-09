import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import { PrismaService } from '../prisma.service';
import * as fsSync from 'fs';
import { format } from 'date-fns';
import { UsersService } from '../users/users.service';

@Injectable()
export class FileStorageService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async getFileContent(userId: string, fileSourceId: string) {
    const filePath = `./${this.configService.get<string>('FILE_STORAGE_PATH')}/${fileSourceId}`;

    const fileRecord = await this.prisma.file.findFirst();

    try {
      let data = await fs.readFile(filePath, 'utf8');

      if (fileRecord.parseJson) {
        data = JSON.parse(data);
      }

      if (fileRecord.encrypted) {
        data = data.replace(/\\/g, '');
      }

      return data;
    } catch (error) {
      // Return empty data if file not exists.
      if (error.errno === -2) {
        return null;
      }

      throw new InternalServerErrorException();
    }
  }

  async getAuthUserFileByType(userId: string, fileType: string) {
    const user = await this.usersService.findOne({
      id: userId,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const file = await this.prisma.file.findFirst({
      where: {
        userId,
        description: fileType,
      },
    });

    if (!file) {
      return null;
    }

    return await this.getFileContent(userId, file.id);
  }

  async updateFileContent(userId: string, fileSourceId: string, data: string) {
    const filePath = `./${this.configService.get<string>('FILE_STORAGE_PATH')}/${fileSourceId}`;

    const fileRecord = await this.prisma.file.findFirst();

    if (fileRecord.parseJson) {
      data = JSON.stringify(data);
    }

    await fs.writeFile(filePath, data, {
      flag: 'w',
    });

    await this.createFileStorageBackup(userId, fileSourceId);
  }

  async createFileStorageBackup(userId: string, fileSourceId: string) {
    const filePath = `./${this.configService.get<string>('FILE_STORAGE_PATH')}/${fileSourceId}`;

    // The case when file does not exist.
    if (!fsSync.existsSync(filePath)) {
      return;
    }

    const backupPath = `./${this.configService.get<string>('FILE_STORAGE_BACKUPS_PATH')}`;

    const today = format(new Date(), 'yyyyMMdd');

    const backupFileExtension = `.backup.${today}`;

    const files = await fs.readdir(backupPath);

    const todayBackup = files.find((item) =>
      item.endsWith(backupFileExtension),
    );

    if (!todayBackup) {
      await fs.copyFile(
        filePath,
        `${backupPath}/${fileSourceId}${backupFileExtension}`,
      );
    }
  }
}
