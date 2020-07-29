import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { APIService } from './API.service';
import { AuthService } from './auth.service';
import { Auth } from 'aws-amplify';
import { networkInterfaces } from 'os'
import { PhotoService } from './photo.service'

@Injectable({
  providedIn: 'root'
})
export class PartyService {


  CreatingParty: BehaviorSubject<boolean>;
  AllPartys: BehaviorSubject<any>;

  constructor(
    private apiService: APIService,
    private authServive: AuthService,
    private photoService: PhotoService
  ) { 
    // this.AllPartys.next(null);
    this.CreatingParty = new BehaviorSubject<boolean>(false);
    this.getAllPartys();
    this.subcribeToChanges(this);
  }

  async getAllPartys(){
    this.AllPartys = new BehaviorSubject<any>([]);
      this.AllPartys.next(null)
    setTimeout(() => { //makes sure paryts get called after the user profile has loaded. i hope. this is ass programming not gonna lie
      this.callHere();
     }, 500);
    
  }

  async callHere(){
    
      let x = await this.apiService.ListPartys();

      this.AllPartys.next(x.items);
  }

  async updateAllPartys(){
    let x = await this.apiService.ListPartys();
    this.AllPartys.next(x.items);
  }

  async subcribeToChanges(THIS){
    this.apiService.OnCreatePartyListener.subscribe((evt) => {
      const data = (evt as any).value.data.onCreateParty;
      this.AllPartys.next([...this.AllPartys['_value'], data]);
      
    });

    await this.apiService.OnUpdatePartyListener.subscribe((evt)=>{
      // this.updateAllPartys();
      const data = (evt as any).value.data.onUpdateParty;
      
      for(let i = 0; i < this.AllPartys.value.length; i++){
        if(this.AllPartys.value[i].id === data.id){
          this.AllPartys.value[i] = data;
          this.AllPartys.next(this.AllPartys.value)
        }
      }

      this.AllPartys.value

      
    })

    await this.apiService.OnDeletePartyListener.subscribe((evt)=>{
      this.updateAllPartys()
    })
  }

  getAllPartysSub(): Observable<any> {
    return this.AllPartys.asObservable()
  }

  getParty(): Observable<boolean> {
    return this.CreatingParty.asObservable();
  }
  setParty(newValue): void {
    this.CreatingParty.next(newValue);
  }

  async createPartyInDynamo(name, datetime, discription, longitude, latitude){
    var ownerID;
    if(this.authServive.currentUser){
      ownerID = this.authServive.currentUser.username
    }
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
      usersID: [ownerID],
      profilePicture: this.authServive.currentUser.profilePicture,
      messages: []
    })
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
  }

  async deleteParty(idd){
    await this.apiService.DeleteParty({id:idd})
  }
  

  async toggleJoinParty(partyId){ 
    
    let userid = this.authServive.currentUser.id;
    let party = await this.apiService.GetParty(partyId);
    let user = await this.apiService.GetUser(userid);

    if(party.usersID.includes(userid)){
      
      var index = party.usersID.indexOf(userid);
      party.usersID.splice(index, 1);
      this.updateParty(party);

      if(user.parties.includes(partyId)){
        
        var index = user.parties.indexOf(partyId);
        user.parties.splice(index, 1);
        this.authServive.updateUser(user);
      }
    }else{
      
      party.usersID.push(userid.toString());
      this.updateParty(party);

      if(!user.parties.includes(partyId)){
        
        user.parties.push(partyId.toString());
        this.authServive.updateUser(user);
      }
    }
  }

  async sendMessage(partyId, message, imageName){
   
    let userid = this.authServive.currentUser.id;
    let party = await this.apiService.GetParty(partyId);
    let user = await this.apiService.GetUser(userid);

    let newMessage = this.apiService.CreateMessage({
      creator: userid,
      content: message,
      image: imageName,
      ai:[]
    })

    party.messages.push((await newMessage).id)
    
    this.updateParty(party);

    if(imageName != ""){
      this.authServive.currentUser.images.push((await newMessage).id)
      
      this.authServive.updateUser(this.authServive.currentUser)
    }else{
      

    }
  }

  async returnMessage(messageID){
    // return "dog"
    return await this.apiService.GetMessage(messageID);
  }
}
