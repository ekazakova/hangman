import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable, exhaustMap, take } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.authService.player.pipe(
      take(1),
      exhaustMap(player => {
        if (!player) {
          return next.handle(request);
        }
        const modifiedReq = request.clone({
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            "x-access-token": player.token
        })
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
