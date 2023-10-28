import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { GameComponent } from './game/game.component';
import { AuthGuard } from './services/auth/auth.guard';
import { HistoryListComponent } from './history-list/history-list.component';
import { HistoryDetailsComponent } from './history-details/history-details.component';

const routes: Routes = [
  { path: 'game', 
    component: GameComponent, 
    canActivate: [AuthGuard],
    children: [
      { path: '', component: HistoryListComponent },
      { path: ':id', component: HistoryDetailsComponent },
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', pathMatch: 'full', redirectTo: 'register' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
