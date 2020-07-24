import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../auth.service';
import { APIService } from '../API.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: any;
  waitingForEmailConfirmation = false;

  errorMessages = {
    username: "",
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: ""
  }

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private apiService: APIService
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

  /*
    todo: these should be whats allowed in a password
    At least one digit [0-9]
    At least one lowercase character [a-z]
    At least one uppercase character [A-Z]
    At least one special character [*.!@#$%^&(){}[]:;<>,.?/~_+-=|\]
    At least 8 characters in length, but no more than 32.
  */

  ngOnInit() {
  }

  async register(){
    // console.log("form", this.registerForm);

    if(!(await this.validateUsername()
    && await this.validateName()
    && await this.validateSurname()
    && await this.validateEmail()
    && await this.validatePassword()
    && await this.validateCornfirmPassword())){
      return;
    }

    let createdUser = await this.authService.signUp({
      username: this.registerForm.controls.username.value,
      password: this.registerForm.controls.password.value,
      attributes: {
          email: this.registerForm.controls.email.value,
          name: this.registerForm.controls.name.value
      }
    })

    if("user" in createdUser){
      console.log("created user: ", createdUser)
      this.waitingForEmailConfirmation = true;
      this.authService.setUsername(this.registerForm.controls.username.value);
      this.authService.createUserInDynamo(this.registerForm.controls.username.value,this.registerForm.controls.name.value, this.registerForm.controls.surname.value, this.registerForm.controls.email.value);
      // this.authService.currentSession()
    }else{
      console.log("couldnt create user: ", createdUser)
      if(createdUser.code == "UsernameExistsException"){
        this.errorMessages.username = "username already exists";
      }
    }
  }



  async validateUsername(){
    this.errorMessages.username = "";
    if(this.registerForm.controls.username.status == "INVALID"){
      //todo: be more specific with what is invalid
      this.errorMessages.username = "Username is invalid";
      return false;
    }
    return true;
  }

  async validateName(){
    this.errorMessages.name = "";
    if(this.registerForm.controls.name.status == "INVALID"){
      //todo: be more specific with what is invalid
      this.errorMessages.name = "Name is invalid";
      return false;
    }
    return true;
  }

  async validateSurname(){
    this.errorMessages.surname = "";
    if(this.registerForm.controls.surname.status == "INVALID"){
      //todo: be more specific with what is invalid
      this.errorMessages.surname = "Surname is invalid";
      return false;
    }
    return true;
  }

  async validateEmail(){
    this.errorMessages.email = "";
    if(this.registerForm.controls.email.status == "INVALID"){
      //todo: be more specific with what is invalid
      this.errorMessages.email = "Email is invalid";
      return false;
    }
    return true;
  }

  async validatePassword(){
    this.errorMessages.password = "";
    if(this.registerForm.controls.password.status == "INVALID"){
      //todo: be more specific with what is invalid
      this.errorMessages.password = "Password is invalid";
      return false;
    }
    return true;
  }

  async validateCornfirmPassword(){
    this.errorMessages.confirmPassword = "";
    if(this.registerForm.controls.confirmPassword.status == "INVALID"){
      //todo: be more specific with what is invalid
      this.errorMessages.confirmPassword = "confirmPassword is invalid";
      return false;
    }else if(this.registerForm.controls.confirmPassword.value != this.registerForm.controls.password.value){
      this.errorMessages.confirmPassword = "Passwords do not match";
      return false;
    }
    return true;
  }
}
