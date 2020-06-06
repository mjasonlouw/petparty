import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { APIService } from './API.service';
import { AuthService } from './auth.service';
import { Auth } from 'aws-amplify';

@Injectable({
  providedIn: 'root'
})
export class PartyService {


  CreatingParty: BehaviorSubject<boolean>;

  constructor(
    private apiService: APIService,
    private authServive: AuthService
  ) { 
    this.CreatingParty = new BehaviorSubject<boolean>(false);
  }

  getParty(): Observable<boolean> {
    return this.CreatingParty.asObservable();
  }
  setParty(newValue): void {
    console.log("newvalue", newValue)
    this.CreatingParty.next(newValue);
  }

  async createPartyInDynamo(name, datetime, discription, longitude, latitude){
    console.log("craeting the party")
    var ownerID;
    if(this.authServive.currentUser){
      ownerID = this.authServive.currentUser.username
    }
    console.log()
    let y = await this.apiService.CreateParty({
      location:{
        longitude,
        latitude
      },
      name,
      datetime: new Date(datetime).toISOString(),
      discription,
      ownerID
    })
    console.log("created party", y)
  }

}
