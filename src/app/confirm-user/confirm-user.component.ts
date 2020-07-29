import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-user',
  templateUrl: './confirm-user.component.html',
  styleUrls: ['./confirm-user.component.scss']
})
export class ConfirmUserComponent implements OnInit {

  confirmUserForm: any;
  loading = false;

  errorMessages = {
    confirmUser: "",
    username: "",
    confirmCode: ""
  }

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.confirmUserForm = this.formBuilder.group({
      username: new FormControl('', [Validators.required, Validators.maxLength(25), Validators.minLength(1), Validators.pattern('^[a-zA-Z1-9]+$')]),
      confirmCode: new FormControl('', [Validators.required, Validators.maxLength(128), Validators.minLength(8)])
    });
  }

  async confirmUser(){
    this.loading = true;

    let confirmedUser = await this.authService.confirmSignUp(this.confirmUserForm.controls.confirmCode.value);


    if(confirmedUser == "SUCCESS"){
    
      await this.authService.autoSignIn()
      this.router.navigate(['/home']);
    }else{
   
      this.errorMessages.confirmCode = "Could not confirm user";
    }
    this.loading = false;
  }
}
