import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { APIService } from './API.service';
import { AuthService } from './auth.service';
import { Auth } from 'aws-amplify';
import { networkInterfaces } from 'os';

@Injectable({
  providedIn: 'root'
})
export class PartyService {


  CreatingParty: BehaviorSubject<boolean>;
  AllPartys: BehaviorSubject<any>;

  constructor(
    private apiService: APIService,
    private authServive: AuthService
  ) { 
    // this.AllPartys.next(null);
    this.CreatingParty = new BehaviorSubject<boolean>(false);
    this.getAllPartys();
    this.subcribeToChanges(this);
  }

  async getAllPartys(){
    console.log("updating party list")
    this.AllPartys = new BehaviorSubject<any>([]);
    this.AllPartys.next(null)
    let x = await this.apiService.ListPartys();
    
    this.AllPartys.next(x.items);
    console.log(this.AllPartys)

   
  }

  async updateAllPartys(){
    let x = await this.apiService.ListPartys();
    this.AllPartys.next(x.items);
    console.log(this.AllPartys)
  }

  async subcribeToChanges(THIS){
    this.apiService.OnCreatePartyListener.subscribe((evt) => {
      // console.log("PARTY LISTENER: ", evt)
      const data = (evt as any).value.data.onCreateParty;
      this.AllPartys.next([...this.AllPartys['_value'], data]);
      // console.log("SHOULD have new party", this.AllPartys)
    });

    await this.apiService.OnUpdatePartyListener.subscribe((evt)=>{
      this.updateAllPartys();
      // const data = (evt as any).value.data.onUpdateParty;
      // console.log("A PARTY WAS UPDATED", data)
    })
  }

  getAllPartysSub(): Observable<any> {
    return this.AllPartys.asObservable()
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
      ownerID,
      images: [],
      usersID: [],
      profilePicture: "",
      messages: []
    })
    console.log("created party", y)
  }

  async updateParty(party){
    let x = {
      id:party.id, 
      name: party.name, 
      location: {
        latitude: party.location.latitude,
        longitude: party.location.longitude
      }, 
      datetime: party.datetime,
      discription: party.discription,
      ownerID: party.ownerID,
      usersID: party.usersID,
      messages: party.messages,
      images: party.images,
      profilePicture: party.profilePicture
    }

    let updateP = await this.apiService.UpdateParty(x);
    console.log(updateP)
  }
  

  async toggleJoinParty(partyId){ 
    console.log("Current user: ",this.authServive.currentUser.id)
    let userid = this.authServive.currentUser.id;
    let party = await this.apiService.GetParty(partyId);
    let user = await this.apiService.GetUser(userid);

    if(party.usersID.includes(userid)){
      console.log("remove from party")
      var index = party.usersID.indexOf(userid);
      party.usersID.splice(index, 1);
      this.updateParty(party);

      if(user.parties.includes(partyId)){
        console.log("removing from user")
        var index = user.parties.indexOf(partyId);
        user.parties.splice(index, 1);
        this.authServive.updateUser(user);
      }
    }else{
      console.log("add to party")
      party.usersID.push(userid.toString());
      this.updateParty(party);

      if(!user.parties.includes(partyId)){
        console.log("add to user")
        user.parties.push(partyId.toString());
        this.authServive.updateUser(user);
      }
    }
  }

  async sendMessage(partyId, message){
    console.log("Current user: ",this.authServive.currentUser.id)
    let userid = this.authServive.currentUser.id;
    let party = await this.apiService.GetParty(partyId);
    let user = await this.apiService.GetUser(userid);

    let newMessage = this.apiService.CreateMessage({
      creator: userid,
      content: message
    })

    party.messages.push((await newMessage).id)
    console.log("updated party:", party)
    this.updateParty(party);
  }

  async returnMessage(messageID){
    // return "dog"
    return await this.apiService.GetMessage(messageID);
  }
}
