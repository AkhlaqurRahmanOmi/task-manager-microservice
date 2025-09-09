import { HttpException, HttpStatus } from '@nestjs/common';

type ExceptionOptions = {
  statusCode: HttpStatus;
  errorCode?: string;
  details?: any;
};

export class HttpExceptionBase extends HttpException {
  constructor(
    message: string,
    options: ExceptionOptions = {
      statusCode: HttpStatus.BAD_REQUEST,
      errorCode: 'BAD_REQUEST'
    }
  ) {
    const { statusCode, errorCode, details } = options;
    super(
      {
        statusCode,
        message,
        error: errorCode || HttpStatus[statusCode] || 'UNKNOWN_ERROR',
        details: details || undefined,
        timestamp: new Date().toISOString(),
      },
      statusCode
    );
  }
}

export class PaginationException extends HttpExceptionBase {
  constructor(message: string, details?: any) {
    super(message, {
      statusCode: HttpStatus.BAD_REQUEST,
      errorCode: 'PAGINATION_ERROR',
      details
    });
  }
}

// Example usage for common exceptions
export class NotFoundException extends HttpExceptionBase {
  constructor(message: string, details?: any) {
    super(message, {
      statusCode: HttpStatus.NOT_FOUND,
      errorCode: 'NOT_FOUND',
      details
    });
  }
}

export class ValidationException extends HttpExceptionBase {
  constructor(message: string, details?: any) {
    super(message, {
      statusCode: HttpStatus.BAD_REQUEST,
      errorCode: 'VALIDATION_ERROR',
      details
    });
  }
}

export class UnauthorizedException extends HttpExceptionBase {
  constructor(message = 'Unauthorized', details?: any) {
    super(message, {
      statusCode: HttpStatus.UNAUTHORIZED,
      errorCode: 'UNAUTHORIZED',
      details
    });
  }
}

// You can create new exceptions on the fly using the base class
export const createCustomException = (
  message: string,
  status: HttpStatus,
  errorCode: string,
  details?: any
) => {
  return new HttpExceptionBase(message, { statusCode: status, errorCode, details });
};