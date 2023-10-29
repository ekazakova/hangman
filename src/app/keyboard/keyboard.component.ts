import { Component, Input } from '@angular/core';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { GameService, KEYS2 } from '../services/game.service';

// const KEYS = [
//   ["q","w","e","r","t","y","u","i","o","p"],
//   ["a","s","d","f","g","h","j","k","l"],
//   ["z","x","c","v","b","n","m"]
// ];
@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss']
})
export class KeyboardComponent {
  @Input() keyboard = KEYS2;
  keyPressSubscription: Subscription;

  constructor(private gameService: GameService) {}

  ngOnInit() {
      // this.keys = [...KEYS];
      this.keyPressSubscription = fromEvent(document, 'keypress').subscribe((e: KeyboardEvent) => {
        console.log(e, e.key, this._isKeyPressedALetter(e.keyCode));
      })
  }
  
  ngOnDestroy() {
    if(this.keyPressSubscription) {
      this.keyPressSubscription.unsubscribe();
    }
  }

  checkLetter(c: string) {
    this.gameService.checkLetter(c)
  }

  processCharFromKeyboard(event) {
    if(event.srcElement.text) {
      const char = event.srcElement.text.trim().toLowerCase()
      if(!char || !(char.length === 1) || !this._isCharacterALetter(char))
        return;
      console.log(event.srcElement.text)
      this.checkLetter(char)
    }
  }

 

  processCharFromKeyPress(e: KeyboardEvent) {
    if(!this._isKeyPressedALetter(e.keyCode)) 
      return;
    this.checkLetter(e.key)
  }

  private _isCharacterALetter(c: string) {
    return !!c.match(/[a-z]/i);
  }

  private _isKeyPressedALetter(charCode: number) {
    return (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122)
  }
}
