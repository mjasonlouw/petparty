import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { PartyService } from '../party.service';
import { LocationService } from '../location.service';

@Component({
  selector: 'app-create-party',
  templateUrl: './create-party.component.html',
  styleUrls: ['./create-party.component.scss']
})
export class CreatePartyComponent implements OnInit {

  creatingParty: boolean;
  errorMessages = {
    name: "",
    time: "",
    desciption: "",
    location: ""
  }
  createPartyForm: any

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private parytService: PartyService,
    private locationService: LocationService
  ) { 
    this.createPartyForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required, Validators.maxLength(25), Validators.minLength(1)]),
      time: new FormControl(new Date().toISOString().slice(0, -1)),
      desciption: new FormControl(''),
    });
  }

  ngOnInit(): void {
  }

  createParty(){
    // console.log("time:", this.createPartyForm.controls.time.value)
    // console.log("name:", this.createPartyForm.controls.name.value)
    // console.log("desciption:", this.createPartyForm.controls.desciption.value)

    if(this.locationService.hasChosenALocation){
      console.log(this.locationService.partyLocation)
      this.parytService.createPartyInDynamo(this.createPartyForm.controls.name.value, this.createPartyForm.controls.time.value, this.createPartyForm.controls.desciption.value, this.locationService.partyLocation.longitude, this.locationService.partyLocation.latitude)
      this.createPartyForm.reset();
      this.parytService.setParty(false);
      }else{
        console.log("Please choose a location first") 
      }

  }

  cancelPartyCreation(){
    this.parytService.setParty(false);

    }

  async createPartyLocation(){
      this.parytService.setParty(true);
  }

}
