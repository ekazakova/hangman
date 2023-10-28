import { Component, OnInit } from '@angular/core';
import { GameHistoryService } from '../services/history.service';
import { Observable, filter, map, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Word, WordData } from '../model/word.model';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss']
})
export class HistoryListComponent implements OnInit {

  list$: Observable<Word[]>;
  gameInProgress$: Observable<Word>;

  constructor(private gameHistoryService: GameHistoryService, private router: Router) {}

  ngOnInit() {
    this.list$ = this.gameHistoryService.historyList$.pipe(
      map(data=>data.filter(item => item["status"] === 2)),
      // filter(item => item.status === 2)
      tap(data => console.log(data))
    );
    this.gameInProgress$ = this.gameHistoryService.wordInProgress$.pipe(
      map(data => data?.word ? data.word : null));
  }
  
  newGame() {
    this.gameHistoryService.start().subscribe(data => {
      // console.log(data)
      this.onDetailsSelect(data.id)
    });
    // this.router.navigate(["/game/play"])
  }

  onDetailsSelect(id: number) {
    this.router.navigate(["/game", id])
  }
}
