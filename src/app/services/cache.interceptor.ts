import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { HttpCacheService } from './http-cache.service';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {

  constructor(private cacheService: HttpCacheService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if(request.url.includes("/game/list?")) {
      console.log("list call", request.method, request.url)
      // this.cacheService.invalidateUrl(request.url)
      const cahcedReposnse = this.cacheService.get(request.url)
      if(cahcedReposnse) {
        console.log("CACHED DATA")
        return of(cahcedReposnse)
      }
      return next.handle(request).pipe(
        tap((event: HttpEvent<any>) => {
          if(event instanceof HttpResponse) {
            console.log("Caching",request.url, event)
            this.cacheService.set(request.url, event)
          }
        })
      )
    }

    return next.handle(request);
  }
}
