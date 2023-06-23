import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable()
export class ReqResInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    console.log('main request');

    return next.handle(request).pipe(
      map((event) => {
        if (!(event instanceof HttpResponse)) return event;
        console.log('main response');
        return event;
      })
    );
  }
}
