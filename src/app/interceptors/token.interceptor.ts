import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { StoreService } from '../services/store.service';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public store: StoreService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.store.getToken()}`
      }
    });
    return next.handle(request);
  }
}