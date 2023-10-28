import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameHistoryService } from '../services/history.service';
import { Observable, ReplaySubject, combineLatest, map, merge, shareReplay, startWith, tap } from 'rxjs';
import { Word, WordData } from '../model/word.model';

@Component({
  selector: 'app-history-details',
  templateUrl: './history-details.component.html',
  styleUrls: ['./history-details.component.scss']
})
export class HistoryDetailsComponent {
  item$: Observable<WordData>;
  wordInProgressID$: Observable<any> = this.gameHistoryService.wordInProgressID$;

  constructor(private route: ActivatedRoute, private gameHistoryService: GameHistoryService, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe(data => {
      console.log(data)
      const id = +data["id"];
      if(id) {
        this.gameHistoryService.selectedHistoryItemChange(id)
      }
      this.item$ = this.gameHistoryService.wordDetails$.pipe(
        tap(
        d=>{console.log("details:",d)}
      ));
    })
  }

  ngOnDestroy() {
    this.gameHistoryService.selectedHistoryItemChange(null)
  }

  goBack() {
    this.router.navigate(["/game"]);
  }
  play(id = -1) {
    if(id === -1) {
    this.gameHistoryService.start().subscribe(data => {
      console.log(data)
      this.onDetailsSelect(data.id)
    });
  } else {
    this.onDetailsSelect(id)

  }
    // this.router.navigate(["/game/play"])
  }

  onDetailsSelect(id: number) {
    this.router.navigate(["/game", id])
    this.gameHistoryService.selectedHistoryItemChange(id)
  }
}
