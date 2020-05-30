import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  signInForm: any;

  errorMessages = {
    signIn: "",
    username: "",
    password: ""
  }

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signInForm = this.formBuilder.group({
      username: new FormControl('', [Validators.required, Validators.maxLength(25), Validators.minLength(1), Validators.pattern('^[a-zA-Z1-9]+$')]),
      password: new FormControl('', [Validators.required, Validators.maxLength(128), Validators.minLength(8)])
    });
    console.log("route: ",this.router.url)
   }

  ngOnInit() {
    
    // console.log("change ourte")
    // this.router.navigate(['/signIn']);
  }

  async signIn(){
    // console.log("form", this.registerForm);

    if(!(await this.validateUsername() 
    && await this.validatePassword())){
      return;
    }

    let signedInUser = await this.authService.signIn( this.signInForm.controls.username.value, this.signInForm.controls.password.value)

    console.log("signed in user: ", signedInUser)
    if("user" in signedInUser){
      console.log("created user: ", signedInUser)
      this.authService.currentSession()
    }else{
      console.log("couldnt sign in: ", signedInUser)
      if(signedInUser.signIn == "UserNotConfirmedException"){
        this.errorMessages.signIn = "User Not Confirmed";
      }
    }
  }

  async validatePassword(){
    this.errorMessages.password = "";
    if(this.signInForm.controls.password.status == "INVALID"){
      //todo: be more specific with what is invalid
      this.errorMessages.password = "password is invalid";
      return false;
    }
    return true;
  }

  async validateUsername(){
    this.errorMessages.username = "";
    if(this.signInForm.controls.username.status == "INVALID"){
      //todo: be more specific with what is invalid
      this.errorMessages.username = "username is invalid";
      return false;
    }
    return true;
  }

}
