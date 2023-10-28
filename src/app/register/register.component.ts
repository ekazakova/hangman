import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  form: FormGroup;
  errorMessage: string;
  isSubmitted: boolean;
  
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.form = new FormGroup({
      "firstName": new FormControl(null, Validators.required),
      "lastName": new FormControl(null, Validators.required),
      "email": new FormControl(null, [Validators.required, Validators.email]),
      "password": new FormControl(null, [Validators.required, Validators.minLength(7)]),
      "passwordConfirmation": new FormControl(null, [Validators.required,Validators.minLength(7)])
    }, this.passwordConfirming);
  }

  onSubmit() {
    this.isSubmitted = true;
    if (!this.form.valid) {
      return;
    }

    this.authService.register(this.form.value.email, this.form.value.password, this.form.value.passwordConfirmation, this.form.value.firstName, this.form.value.lastName).subscribe(
     {
      next: (value) => {
        
        this.router.navigate(["/game"])
      },
      error: error => {this.errorMessage = error; console.log(error)}
     })
    
  }

  goToLogin() {
    this.router.navigate(["/login"])
  }
  passwordConfirming(fGroup: AbstractControl): { passwordsDontMatch: boolean } | null {
    return fGroup.get('password').value === fGroup.get('passwordConfirmation').value
       ? null : {'passwordsDontMatch': true};
  }
}

