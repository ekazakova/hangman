import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, catchError, map, of, switchMap, take } from 'rxjs';
import { URL } from './auth/auth.service';
import { Word } from '../model/word.model';

const TRY_COUNT = 8;
@Injectable({
  providedIn: 'root'
})
export class PlayService {

  gameInProgress$: Observable<boolean> = this.http.get(`${URL}/game/inProgress`).pipe(
    catchError((err) => {
          console.log(err)
          return EMPTY; //of([])
        }),
    map(data=>{
      this._wordSubject.next(data["data"]);
      return !!data["data"]
    })
  );  

  private _wordSubject = new BehaviorSubject<Word>(null)
  word$: Observable<Word> = this._wordSubject.asObservable();

  attemps$: Observable<any> = this.word$.pipe(
    switchMap((word) => {
      if(!word) 
        return of(null)
      if(!word.playedLetters) 
        return of({words: [], attempsLeft: TRY_COUNT, attemps: 0})
      const w = word.word;
      const letters = word.playedLetters.split(",");
      let attemps = 0;
      const lettersAttemps = letters.reduce((acc,current) => {
        const a = [...acc];
        const rightLetter = w.includes(current);
        if(!rightLetter) attemps++;
        a.push({letter: current, included: rightLetter});
        return a;
      }, [])
      console.log(lettersAttemps)
      const result = {words: [...lettersAttemps], attemps: attemps, attempsLeft: (TRY_COUNT - attemps)}
      console.log(result)
      return of(result)
    })
  )
  
  constructor(private http: HttpClient) { }

  start() {
    return this.http.post(`${URL}/game`,{}).pipe(
      catchError((err) => {
            console.log(err)
            return EMPTY; //of([])
          }),
      map(data=>{
        this._wordSubject.next(data["data"]);
        return data["data"];
      }),
      take(1)
    ).subscribe();
  }

  checkLetter(letter: string) {
    return this.http.post(`${URL}/game/checkLetter`,{letter: letter}).pipe(
      catchError((err) => {
            console.log(err)
            return EMPTY; //of([])
          }),
      map(data=>{
        console.log(data["data"])
        this._wordSubject.next(data["data"]);
        return data["data"];
      }),
      take(1)
    ).subscribe();
  }

  isKeyPressedALetter(charCode: number) {
    return (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122)
  }

  isCharacterALetter(char: string) {
    return char.toUpperCase() != char.toLowerCase();
  }

}
