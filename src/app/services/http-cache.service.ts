import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpCacheService {
  private cache: any = {};
  constructor() { }

  set(url: string, response: HttpResponse<any>) {
    this.cache[url] = response;
  }

  get(url: string) : HttpResponse<any> | undefined {
    return this.cache[url]
  }

  invalidateUrl(url: string) {
    delete this.cache[url];
  }

  invalidateCache() {
    this.cache = {};
  }
}
