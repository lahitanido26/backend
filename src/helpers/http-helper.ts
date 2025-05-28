import { Injectable } from '@nestjs/common';
import { Observable, catchError, of } from 'rxjs';
import { Response } from 'express';
import { FormatResponse } from './interfaces/format-response';

@Injectable()
export class HttpHelper {
  constructor() {}

  responseHttpHandler = (http: Observable<any>) => {
    http
      .pipe(
        catchError((error) => {
          console.error('Error occurred:', error.cause);
          return of(null);
        }),
      )
      .subscribe((response) => {
        if (response !== null) {
          console.log(response.data);
        }
      });
  };

  getMessageFromStatusCode = (status: number): string => {
    let message: string;
    switch (status) {
      case 200:
        message = 'OK';
        break;
      case 201:
        message = 'CREATED';
        break;
      case 400:
        message = 'BAD_REQUEST';
        break;
      default:
        message = 'NOT_DEFINED';
    }
    return message;
  };

  formatResponse = (
    response: Response,
    status: number,
    data: any,
  ): Response<any, Record<string, any>> => {
    const message = this.getMessageFromStatusCode(status);
    const res: FormatResponse = { message, data };
    return response.status(status).send(res);
  };
}
