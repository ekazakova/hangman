import { Component, Input } from '@angular/core';
import { GameService } from '../services/game.service';

const errors = {
  deault: "Something wrong with your input! Try something else",
  notALetter: "Please enter a letter",
  alreadyPlayed: "This letter is already played"
}
@Component({
  selector: 'app-letter',
  templateUrl: './letter.component.html',
  styleUrls: ['./letter.component.scss']
})
export class LetterComponent {
  @Input() playedLetters: string;
  char: string = "";
  errorMessage: string;
  
  constructor(private gameService: GameService) {}
  
  processCharFromInput(c: string) {
    if(!this.gameService.isCharacterALetter(this.char) || this.char.length !== 1) 
      return;
    this.gameService.checkLetter(this.char);
    this.char = ""
  }

  isInputInvalid() {
    return !this.gameService.isCharacterALetter(this.char) || this._isAlreadyPlayed(this.char) || this.char.length > 1;
  }

  checkInput(input) {
    if(this.isInputInvalid()) {
      this._showErrorMessage(input,"default")
      if(!this.gameService.isCharacterALetter(this.char)) {
        this._showErrorMessage(input,"notALetter")
      } else if(this._isAlreadyPlayed(this.char)) {
        this._showErrorMessage(input,"alreadyPlayed")
      }
    } else {
          this.errorMessage = "";
    }
  }

  private _isAlreadyPlayed(c: string) {
    return !!this.playedLetters && this.playedLetters.includes(c);
  }

  private _showErrorMessage(input,errorKey) {
    this.errorMessage = errors[errorKey];
    input.focus();
    input.select();
  }
}
