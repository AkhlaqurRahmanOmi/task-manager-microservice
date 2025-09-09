import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PaginationResponse } from '../utils/pagination.util';

interface ExceptionResponse {
  statusCode: number;
  message: string;
  error?: string;
  code?: string;
  details?: any;
  timestamp?: string;
  path?: string;
  pagination?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    itemsPerPage?: number;
    currentPage?: number;
    itemCount?: number;
  };
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_SERVER_ERROR';
    let details: any = null;
    let pagination: ExceptionResponse['pagination'] = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else {
        const responseObj = exceptionResponse as Record<string, any>;
        message = responseObj.message || message;
        code = responseObj.code || responseObj.error || `HTTP_${status}`;
        details = responseObj.details || null;
        pagination = responseObj.pagination;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      if (process.env.NODE_ENV !== 'production') {
        details = {
          name: exception.name,
          stack: exception.stack,
        };
      }
    }

    // Don't expose internal errors in production
    if (status >= 500 && process.env.NODE_ENV === 'production') {
      message = 'Internal server error';
      details = null;
    }

    const errorResponse: ExceptionResponse = {
      statusCode: status,
      message,
      code,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Only add properties if they have values
    if (details) {
      errorResponse.details = details;
    }

    if (pagination) {
      errorResponse.pagination = pagination;
    }

    response.status(status).json(errorResponse);
  }
}