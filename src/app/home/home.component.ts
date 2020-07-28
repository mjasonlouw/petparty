import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../auth.service';
import { PartyService } from '../party.service';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  creatingParty: boolean;
  userProfile: any;
  showUserProfilePage = false;
  @ViewChild("postStatus") postStatus : ElementRef;
  @ViewChild("textStatus") textStatus : ElementRef;
  allChats: any = {}
  partiesJoined = 0;
  partiesHosted = 0;

  constructor(
    public authService: AuthService,
    private partyService: PartyService
  ) {
    this.subscribeToCreatingParty(this)
    this.userProfile = this.authService.currentUser;
    this.replaceIdWithMessage();
    setTimeout(() => {
      this.replaceIdWithMessage()
  }, 1000);
   }

  ngOnInit() {
  }

  async logout(){
    this.authService.logout();
  }

  async createParty(){
      this.partyService.setParty(!this.creatingParty);
  }

  toggleUserProfilePage(){
    this.userProfile = this.authService.currentUser;
    this.showUserProfilePage = !this.showUserProfilePage;
    this.replaceIdWithMessage();


  }

  calculatePartiesVisited(){
    this.partiesJoined = this.userProfile.parties.length;
    this.userProfile.parties.forEach(element => {

    });
  }

  subscribeToCreatingParty(THIS) {
    this.partyService.getParty().subscribe((value) => {
      console.log("is creating party ",value);
      THIS.creatingParty = value;
    });
  }

  typing($event){
    console.log("typing in profile, ", $event)
  }

  createUrl(key){
    return "https://petparty-bucket.s3.eu-west-1.amazonaws.com/"+key;
  }

   failedTo( messageID){
    console.log("failed to load")

    this.userProfile.images.forEach(m => {
      if(m.id == messageID){
        if(m.image == null)
          return
        let temp = m.image
        m.image = ""
        setTimeout(function () {
          m.image = temp;
      }, 1000);
      }
    });
  }

  async replaceIdWithMessage(){
    if(!this.authService.currentUser){

    }else{
      console.log("helps",this.authService.currentUser)

      this.authService.currentUser.images.forEach(async element => {
        // console.log("message", element)
        let messageObj = await this.partyService.returnMessage(element);
        // var index = this.allChats[element].messages.indexOf(element);
        // console.log("message object",messageObj)

        this.allChats["hey"] = {hey:"yoh"}
        // console.log("chats",this.allChats)
        delete this.allChats['hey'];

        this.allChats = this.allChats;


          this.allChats[element] = messageObj;

      });
    }

  }

  async randomPFP(){
    console.log("randomise pfp")
    await this.authService.randomizePFP();
    this.userProfile = this.authService.currentUser;
  }

  containsPerson(array):boolean{
    for(let i = 0; i < array.length; i++){
      if(array[i].includes('person'))
        return true;
    }
    return false;
  }

  containsDog(array):boolean{
    for(let i = 0; i < array.length; i++){
      if(array[i].includes('dog'))
        return true;
    }
    return false;
  }

  containsCat(array):boolean{
    for(let i = 0; i < array.length; i++){
      if(array[i].includes('cat'))
        return true;
    }
    return false;
  }
}
