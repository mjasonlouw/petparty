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

  loading = false;

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
    console.log("signing in")
    this.loading = true;
    let signedInUser = await this.authService.signIn( this.signInForm.controls.username.value, this.signInForm.controls.password.value)

    if("code" in signedInUser){
      console.log("couldnt sign in: ", signedInUser)
      if(signedInUser.code == "UserNotConfirmedException"){
        this.errorMessages.signIn = "User Not Confirmed";
      }else if (signedInUser.code == "UserNotFoundException"){
        this.errorMessages.signIn = "Invalid Username or Password";
      }else if (signedInUser.code == "NotAuthorizedException"){
        this.errorMessages.signIn = "Invalid Username or Password";
      }else{
        this.errorMessages.signIn = "Username or Password incorrect";
      }
    }else{
      this.router.navigate(['/home'])
    }
    this.loading = false;
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
