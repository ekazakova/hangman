import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, catchError, map, shareReplay } from 'rxjs';
import { Word } from '../model/word.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private http: HttpClient) { }

  loadHistoryList(page: number = 1, pageSize: number = 100): Observable<Word[]> {
    return this.http.get<Word[]>(`${URL}/game/list?page=${page}&limit=${pageSize}`).pipe(
      catchError((err) => {
            console.log(err)
            return EMPTY; //of([])
          }),
      map(res => res["data"]),
      shareReplay()
    );
  }
}
