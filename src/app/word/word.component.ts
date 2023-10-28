import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss']
})
export class WordComponent {
  @Input() wordList;
  @Input() markedLetters;
  @Input() gameInProgress: boolean;

}
