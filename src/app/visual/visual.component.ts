import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Observable, combineLatest, filter, map, tap } from 'rxjs';
import { GameService } from '../services/game.service';
import { WordData } from '../model/word.model';

const SVGs = {
  login: "login",
  register: "register",
  history: "history",  
  hangman: "hangman",
  default: "default"
}
// const SVG_URLS = {
//   login: "login.svg",
//   register: "register.svg",
//   history: "history.svg",  
//   hangman: "hangman.svg",
//   default: "game-default.svg"
// }
// const SVG_PATH = "assets/svg/";
@Component({
  selector: 'app-visual',
  templateUrl: './visual.component.html',
  styleUrls: ['./visual.component.scss']
})
export class VisualComponent {
  @ViewChild('login') login:TemplateRef<any>;
  @ViewChild('register') register:TemplateRef<any>;
  @ViewChild('history') history:TemplateRef<any>;
  @ViewChild('hangman') hangman:TemplateRef<any>;
  @ViewChild('default') default:TemplateRef<any>;
  template: TemplateRef<any>;
  
  attemps$: Observable<number>;

  constructor(private router: Router, private gameService: GameService) {
  
  }
  ngOnInit(){
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(data=>{
      
      console.log("visual",data['url']);
      this.getSvgTemplate(data["url"]);
    })
    this.attemps$ = this.gameService.wordDetails$.pipe(
      tap(d=>console.log("VISUALLLLL",d)),
      map(w=>{
        if(!w)
          return 9;
        return this.gameService.getAttemps(w.word.word,w.word.playedLetters)}),
      tap(d=>console.log("VISUALLLLL",d))
    );
    
  }

  getSvgTemplate(url) {
    this.template = this.default;

    if (url === "/login") {
      this.template = this.login;
    } else if (url === "/register") {
      this.template = this.register;
    } else if (url === "/game") {
      this.template = this.history;
    } else if (url.startsWith("/game/")){
      this.template = this.hangman;
    }
  }
  
}
