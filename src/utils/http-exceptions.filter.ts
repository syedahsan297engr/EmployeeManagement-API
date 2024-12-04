import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException, BadRequestException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctxType = host.getType<'http' | 'graphql'>();

    if (ctxType === 'http') {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      const message =
        typeof exceptionResponse === 'object' && 'message' in exceptionResponse
          ? exceptionResponse['message']
          : exception.message || 'Internal server error';

      return response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message,
      });
    } else if (ctxType === 'graphql') {
      // Let GraphQL handle the exception itself
      throw exception; // Propagate the exception to the GraphQL layer
    }
  }
}
