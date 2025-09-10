import {
  HttpEvent,
  HttpHandlerFn,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorage } from '../services/local-storage/local-storage';
import { inject } from '@angular/core';

export function tokenInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const ls = inject(LocalStorage);

  if (
    request.url === 'http://localhost:4000/v1/auth/register' ||
    request.url === 'http://localhost:4000/v1/auth/login'
  ) {
    return next(request);
  } else {
    const token = ls.getItem('token') as string;

    // if token exists
    if (token) {
      const modified_request = request.clone({
        headers: new HttpHeaders().append('token', token),
      });
      return next(modified_request);
    }
    return next(request);
  }
}
