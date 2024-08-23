import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { LoggerMiddleware } from './conception/middleware';
import { PrismaService } from './prisma.service';
import { ClientsController } from './clients/clients.controller';
import { ClientsService } from './clients/clients.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TimeSlotsController } from './time-slot/time-slots.controller';
import { TimeSlotsService } from './time-slot/time-slots.service';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { FileStorageController } from './file-storage/file-storage.controller';
import { FileStorageService } from './file-storage/file-storage.service';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true, // This makes the configuration globally available in the application
    }),
  ],
  controllers: [
    AppController,
    UsersController,
    ClientsController,
    TimeSlotsController,
    FileStorageController,
  ],
  providers: [
    AppService,
    UsersService,
    PrismaService,
    ClientsService,
    TimeSlotsService,
    FileStorageService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('users');
  }
}
