import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: any;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { 
    this.registerForm = this.formBuilder.group({
      username: new FormControl('', [Validators.required, Validators.maxLength(25), Validators.minLength(1), Validators.pattern('^[a-zA-Z1-9]+$')]),
      name: new FormControl('', [Validators.required, Validators.maxLength(25), Validators.minLength(1), Validators.pattern('^[A-Za-z]+$')]),
      surname: new FormControl('', [Validators.required, Validators.maxLength(25), Validators.minLength(1), Validators.pattern('^[A-Za-z]+$')]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(50), Validators.minLength(1)]),
      password: new FormControl('', [Validators.required, Validators.maxLength(128), Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.maxLength(32), Validators.minLength(8)]),
    });
  }

// At least one digit [0-9]
// At least one lowercase character [a-z]
// At least one uppercase character [A-Z]
// At least one special character [*.!@#$%^&(){}[]:;<>,.?/~_+-=|\]
// At least 8 characters in length, but no more than 32.

  ngOnInit() {
  }

  async register(){
    console.log("form", this.registerForm);
    
    if(this.registerForm.controls.username.status == "INVALID"){
      console.log("username is invalid")
    }else if(this.registerForm.controls.name.status == "INVALID"){
      console.log("name is invalid")
    }else if(this.registerForm.controls.surname.status == "INVALID"){
      console.log("surname is invalid")
    }else if(this.registerForm.controls.email.status == "INVALID"){
      console.log("email is invalid")
    }else if(this.registerForm.controls.password.status == "INVALID"){
      console.log("password is invalid")
    }else if(this.registerForm.controls.confirmPassword.status == "INVALID"){
      console.log("confirmPassword is invalid")
    }

    if(this.registerForm.status == "VALID"){
      console.log("valid", this.registerForm);
      let user = await this.authService.signUp({
        username: this.registerForm.controls.username.value,
        password: this.registerForm.controls.password.value,
        attributes: {
            email: this.registerForm.controls.email.value,
            name: this.registerForm.controls.name.value
        }
      })
      console.log(user)
    }
  }

}
