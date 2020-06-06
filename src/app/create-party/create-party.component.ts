import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { PartyService } from '../party.service';

@Component({
  selector: 'app-create-party',
  templateUrl: './create-party.component.html',
  styleUrls: ['./create-party.component.scss']
})
export class CreatePartyComponent implements OnInit {

  errorMessages = {
    name: "",
    time: "",
    duration: "",
    location: ""
  }
  createPartyForm: any

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private parytService: PartyService
  ) { 
    this.createPartyForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required, Validators.maxLength(25), Validators.minLength(1)]),
      time: new FormControl(new Date().toISOString().slice(0, -1)),
      duration: new FormControl(60),
    });
  }

  ngOnInit(): void {
  }

  createParty(){
    console.log("time:", this.createPartyForm.controls.time.value)
    console.log("name:", this.createPartyForm.controls.name.value)
    console.log("duration:", this.createPartyForm.controls.duration.value)

  }

  cancelPartyCreation(){
    this.parytService.setParty(false);
  }
}
