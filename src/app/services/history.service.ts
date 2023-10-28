import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL } from './auth/auth.service';
import { BehaviorSubject, EMPTY, Observable, Subject, catchError, combineLatest, filter, map, merge, of, shareReplay, startWith, switchMap, take, tap, throwError } from 'rxjs';
import { LetterMarked, Word, WordData } from '../model/word.model';
import { HttpCacheService } from './http-cache.service';

export const KEYS2: LetterMarked[][] = [
  [{letter: "q", included: false},{letter: "w", included: false},{letter: "e", included: false},{letter: "r", included: false},{letter: "t", included: false},{letter: "y", included: false},{letter: "u", included: false},{letter: "i", included: false},{letter: "o", included: false},{letter: "p", included: false}],
  [{letter: "a", included: false},{letter: "s", included: false},{letter: "d", included: false},{letter: "f", included: false},{letter: "g", included: false},{letter: "h", included: false},{letter: "j", included: false},{letter: "k", included: false},{letter: "l", included: false}],
  [{letter: "z", included: false},{letter: "x", included: false},{letter: "c", included: false},{letter: "v", included: false},{letter: "b", included: false},{letter: "n", included: false},{letter: "m", included: false}]
];

const MAX_ATTEMPS: number = 9;
// const KEYS = [
//   [{"q": false},{"w":false},{"e":false},{"r":false},{"t":false},{"y":false},{"u":false},{"i":false},{"o":false},{"p":false}],
//   [{"a":false},{"s":false},{"d":false},{"f":false},{"g":false},{"h":false},{"j":false},{"k":false},{"l":false}],
//   [{"z":false},{"x":false},{"c":false},{"v":false},{"b":false},{"n":false},{"m":false}]
// ];

@Injectable({
  providedIn: 'root'
})
export class GameHistoryService {
  wordInProgress$: Observable<WordData> = this.http.get(`${URL}/game/inProgress`).pipe(
    catchError((err) => {
          console.log(err)
          return EMPTY; //of([])
        }),
    map(data=>{
      // this.wordInProgressChange(data["data"]);
      const word = data["data"]?.id ? data["data"]?.id : null;
      this._wordInProgressIDSubject.next(word)
      if(word) {
        this._wordInProgressAttempsSubject.next(this.getAttemps(word.word, word.playedLetters))
        // this.wordInProgressChange(word);
      }
      return data["data"]
    }),
    map(data => this.processWord(data)),
    tap(d => console.log("wordInProgress", d))
  );  
  // gameInProgress$: Observable<boolean> = this.wordInProgress$.pipe(
  //   switchMap(data => of(!!data))
  // )


  historyList$: Observable<Word[]> = this.http.get(`${URL}/game/list?page=1&limit=1000`).pipe(
      catchError((err) => {
            // to do
            console.log(err)
            return EMPTY; //of([])
          }),
      map(data=>data["data"]),
      // shareReplay()
    );

  private _wordSubject = new BehaviorSubject<Word>(null)
  word$: Observable<Word> = this._wordSubject.asObservable().pipe(
    tap(d => console.log("word", d))
  );

  private _wordInProgressIDSubject = new BehaviorSubject<number>(null)
  wordInProgressID$: Observable<number> = this._wordInProgressIDSubject.asObservable().pipe(
    tap(d => console.log("word", d))
  );

  private _wordInProgressAttempsSubject = new BehaviorSubject<number>(null)
  wordInProgressAttemps$: Observable<number> = this._wordInProgressAttempsSubject.asObservable().pipe(
    tap(d => console.log("word", d))
  );

  private historyItemSelectedSubject = new BehaviorSubject<number>(null)
  historyItemSelectedAction$ = this.historyItemSelectedSubject.asObservable();

  // wordDetails$: Observable<WordData> = combineLatest([this.historyList$, this.historyItemSelectedAction$]).pipe(
  //   map(([historyList, historyItemId])=> {
  //     return historyList.find(item => item.id === historyItemId)
  //   }),    
  //   tap(d => {
  //     this.wordInProgressChange(d),
  //     console.log("selected item",d)
  //   }),
  //   catchError(this.handleError),
  //   map(data => this.processWord(data)),
  // )

  selectedHistoryItem2$: Observable<Word> = combineLatest([this.historyList$, this.historyItemSelectedAction$]).pipe(
    tap(d => {
      console.log("selected item",d)
    }),
    map(([historyList, historyItemId])=> {
      return historyList.find(item => item.id === historyItemId)
    }),
    tap(d => {
      if(d != null) 
        this.wordInProgressChange(d),
      console.log("selected item",d)
    }),
    startWith(null)
  )
  wordDetails$ = combineLatest([this.selectedHistoryItem2$, this.word$]).pipe(
    tap(d => console.log("merge in history service",d)),
    switchMap(d => d),
    map(data => this.processWord(data)),
  )
  
  constructor(private http: HttpClient, private listCashService:  HttpCacheService) { }

  selectedHistoryItemChange(id: number): void {
    console.log("selectedHistoryItemChange", id)
    this.historyItemSelectedSubject.next(id)
  }
  
  wordInProgressChange(word: Word): void {
    this._wordSubject.next(word);
  }

  attempsInProgressChange() {

  }


  markLetters(word: string, playedLetters: string): {markedWord, markedPlayedLetters} {
    const wordList = word.split("");

    if(!playedLetters) 
      return {markedWord: wordList, markedPlayedLetters: []};
    
    const letters = playedLetters.split(",");

    const markedPlayedLetters = letters.reduce((acc,current) => {
      const a = [...acc];
      const rightLetter = word.includes(current);
      
      a.push({letter: current, included: rightLetter});
      return a;
    }, []);

    const markedWord = wordList.reduce((acc,current) => {
      const a = [...acc];
      const rightLetter = letters.includes(current);
      
      a.push({letter: current, included: rightLetter});
      return a;
    }, []);
    
    return {markedWord, markedPlayedLetters};
  }

  markKeyboardLetters(playedLetters: string):LetterMarked[][]  {
    const newKeyboard = structuredClone(KEYS2);
    if(playedLetters) {
      newKeyboard.map(row => row.map(k => {
        const key = Object.keys(k)[0]
        if(playedLetters.includes(k["letter"])) {
          k["included"] = true
        }
      }))
      console.log(newKeyboard)
    }
    return newKeyboard;
  }

  start() {
    return this.http.post(`${URL}/game`,{}).pipe(
      catchError((err) => {
            console.log(err)
            return EMPTY; //of([])
          }),
      map(data=>{
        this.listCashService.invalidateCache()
        this.wordInProgressChange(data["data"]);
        this._wordInProgressIDSubject.next(data["data"].id)
        this._wordInProgressAttempsSubject.next(0)
        return data["data"];
      }),
      take(1)
    );
  }

  checkLetter(letter: string) {
    return this.http.post(`${URL}/game/checkLetter`,{letter: letter}).pipe(
      catchError((err) => {
            console.log(err)
            return EMPTY; //of([])
          }),
      map(data=>{
        console.log(data["data"])
        if(data["data"].status === 2) {
          this._wordInProgressIDSubject.next(null)
          this.listCashService.invalidateCache()
        }
        
        this._wordInProgressAttempsSubject.next(this.getAttemps(data["data"].word, data["data"].playedLetters))
        this.wordInProgressChange(data["data"]);
        return data["data"];
      }),
      take(1)
    ).subscribe();
  }

  getAttemps(word, playedLetters): number {
    if(!playedLetters) 
      return 1;
    const letters = playedLetters.split(",");
    if(letters.length === 0)
      return 1;
    const attemps = letters.filter(l => !word.includes(l))
    console.log("attemps",attemps)
    return (attemps.length < MAX_ATTEMPS) ? attemps.length+1 : MAX_ATTEMPS;
    // return MAX_ATTEMPS;
  }

  isKeyPressedALetter(charCode: number): boolean {
    return (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122)
  }

  isCharacterALetter(char: string): boolean {
    return char.toUpperCase() != char.toLowerCase();
  }
  
  private processWord(data: Word): WordData {
    if(!data)
      return null;
    console.log(data)
    const {markedWord, markedPlayedLetters} = this.markLetters(data.word, data.playedLetters)
    const markedKeybaordLetters = this.markKeyboardLetters(data.playedLetters)
    // console.log(markedWord, markedPlayedLetters, markedKeybaordLetters)
    return {
      word: data,
      markedWord: markedWord,
      markedPlayedLetters: markedPlayedLetters,
      markedKeybaordLetters: markedKeybaordLetters
    };
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    //"already_played"
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.message}`;
    }
    console.error(err);
    return throwError(() => errorMessage);
  }
  
}
