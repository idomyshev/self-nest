import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { LoggerMiddleware } from './conception/middleware';
import { PrismaService } from './prisma.service';
import { ScheduleController } from './schedule/schedule.controller';
import { ScheduleService } from './schedule/schedule.service';
import { ClientsController } from './clients/clients.controller';
import { ClientsService } from './clients/clients.service';

@Module({
  imports: [],
  controllers: [AppController, UsersController, ScheduleController, ClientsController],
  providers: [AppService, UsersService, PrismaService, ScheduleService, ClientsService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('users');
  }
}
