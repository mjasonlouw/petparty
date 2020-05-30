import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-confirm-user',
  templateUrl: './confirm-user.component.html',
  styleUrls: ['./confirm-user.component.scss']
})
export class ConfirmUserComponent implements OnInit {

  confirmUserForm: any;

  errorMessages = {
    confirmUser: "",
    username: "",
    confirmCode: ""
  }

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.confirmUserForm = this.formBuilder.group({
      username: new FormControl('', [Validators.required, Validators.maxLength(25), Validators.minLength(1), Validators.pattern('^[a-zA-Z1-9]+$')]),
      confirmCode: new FormControl('', [Validators.required, Validators.maxLength(128), Validators.minLength(8)])
    });
  }

  async confirmUser(){

    let confirmedUser = await this.authService.confirmSignUp( this.confirmUserForm.controls.username.value, this.confirmUserForm.controls.confirmCode.value);

    console.log("confirmed user: ", confirmedUser)
    if(confirmedUser == "SUCCESS"){
      console.log("confirmed user: ", confirmedUser)
      this.authService.currentSession()
    }else{
      console.log("couldnt confirm user: ", confirmedUser) 
      this.errorMessages.confirmCode = "Could not confirm user"; 
    }
  }
}
