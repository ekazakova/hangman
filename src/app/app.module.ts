import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AuthInterceptor } from './services/auth/auth.interceptor';
import { CacheInterceptor } from './services/cache.interceptor';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { GameComponent } from './game/game.component';
import { HistoryListComponent } from './history-list/history-list.component';
import { HistoryDetailsComponent } from './history-details/history-details.component';
import { VisualComponent } from './visual/visual.component';
import { MessageComponent } from './message/message.component';
import { WordComponent } from './word/word.component';
import { KeyboardComponent } from './keyboard/keyboard.component';
import { LetterComponent } from './letter/letter.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    GameComponent,
    HistoryListComponent,
    HistoryDetailsComponent,
    VisualComponent,
    MessageComponent,
    WordComponent,
    KeyboardComponent,
    LetterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    
    {provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
