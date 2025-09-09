import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T = any> {
  success: boolean;
  data?: T;
  timestamp?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const response: Response<T> = {
          success: true,
          timestamp: new Date().toISOString()
        };

        // If it's already formatted (like from services), merge with our base response
        if (data && typeof data === 'object' && ('data' in data || 'pagination' in data)) {
          return {
            ...response,
            ...data
          };
        }

        // Regular response with data
        if (data !== undefined) {
          response.data = data;
        }

        return response;
      })
    );
  }
}