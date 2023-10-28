import { Component } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  errorMessage: string;
  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    this.authService.login(form.value.email,form.value.password).subscribe(
     {
      next: (value) => {
        // console.log(value)
        this.router.navigate(["/game"])
      },
      error: error => {
        this.errorMessage = error;
        console.log(error)
      }
     })
    // console.log(form.value)
    
  }

  goToRegister() {
    this.router.navigate(["/register"])}
}
