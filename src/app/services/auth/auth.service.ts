import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { Player } from 'src/app/model/player.model';
import { User } from 'src/app/model/user.model';
import { Token } from 'src/app/model/token.model';
import { Router } from '@angular/router';

export const URL = "http://3.253.2.17";
export interface AuthResponseData {
  data: {
    user: User, 
    accessToken: Token
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  player = new BehaviorSubject<Player>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

  register(email: string, password: string, passwordConfirmation: string, firstName: string, lastName: string) {

    const player = {
      email: email,
      password: password,
      passwordConfirmation: passwordConfirmation,
      firstName: firstName,
      lastName: lastName
    }
    return this.http.post<AuthResponseData>(`${URL}/user`,player)
    .pipe(
      catchError(this.handleError),
      tap(resData => {
        this.handleAuthentication(
          resData.data.user.email,
          resData.data.user.name,
          +resData.data.user.id,
          resData.data.accessToken.token,
          resData.data.accessToken.expirationDate
        );
      })
    );
  }

  login(email: string, password: string) {

    const player = {
      email: email,
      password: password
    }
    return this.http.post<AuthResponseData>(`${URL}/user/login`,player)
      .pipe(
        catchError(this.handleError),
        tap((resData: AuthResponseData) => {
          // console.log(resData)
          this.handleAuthentication(
            resData.data.user.email,
            resData.data.user.name,
            +resData.data.user.id,
            resData.data.accessToken.token,
            resData.data.accessToken.expirationDate
          );
        })
      );
  }

  autoLogin() {
    const playerData: {
      email: string;
      name: string;
      id: number;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('playerData'));
    if (!playerData) {
      return;
    }

    const loadedPlayer = new Player(
      playerData.email,
      playerData.name,
      playerData.id,
      playerData._token,
      new Date(playerData._tokenExpirationDate)
    );

    if (loadedPlayer.token) {
      this.player.next(loadedPlayer);
      const expirationDuration =
        new Date(playerData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.player.next(null);
    this.router.navigate(['/login']);
    localStorage.removeItem('playerData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(email: string, name: string, id: number, token: string, expirationDate: string) {
    const player = new Player(email, name, id, token, new Date(expirationDate));
    const expiresIn = (new Date(expirationDate)).getTime() - (new Date()).getTime();
    this.player.next(player);
    this.autoLogout(expiresIn);
    localStorage.setItem('playerData', JSON.stringify(player));
  }

  private handleError(errorRes: HttpErrorResponse) {
    console.log(errorRes)
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.errors) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.errors.user) {
      case "invalid_email_or_password":
        errorMessage = 'Email or password is invalid!';
        break;
    }
    switch (errorRes.error.errors.email) {
      case "already_exists":
        errorMessage = 'This email is already use!';
        break;
    }

    switch (errorRes.error.errors.passwordConfirmation) {
      case "password_confirmation_do_not_match":
        errorMessage = 'Passwords don\'t match';
        break;
    }

    
    return throwError(errorMessage);
  }
}
