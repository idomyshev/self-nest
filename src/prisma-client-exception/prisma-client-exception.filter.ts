import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode: number;
    let message: string;

    switch (exception.code) {
      case 'P2002': {
        statusCode = 409;
        message = 'Duplicate entry';
        break;
      }

      // TODO What error to show?
      // Foreign key constraint violation
      // case 'P2003': {
      //  BadRequestException('Foreign key constraint violation');
      // }

      case 'P2025': {
        statusCode = 404;
        message = 'Record not found';
        break;
      }

      default: {
        statusCode = 500;
        message = 'Internal server error';
      }
    }

    (response as any).status(statusCode).json({
      statusCode,
      message,
    });
  }
}
