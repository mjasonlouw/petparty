import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { APIService } from '../API.service';
import { PartyService } from '../party.service';
import { AuthService } from '../auth.service';
import { promises } from 'dns';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  allPartys:any = []
  allChats: any = {}
  inChat: boolean = false;
  activeChat: any = null;

  @ViewChild("postStatus") postStatus : ElementRef;
  @ViewChild("textStatus") textStatus : ElementRef;
  htmlStr: string = '<strong>The Tortoise</strong> &amp; the Hare';
  testText= "here"

  constructor(
    private apiService: APIService,
    private partyService: PartyService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.subscribeToAllPartys(this);
  }

  calculateUnreadMessages(party): Number{
    let savedParty = JSON.parse(localStorage.getItem(party.id));
    if(savedParty)
      return party.messages.length - savedParty.usersID.length;
    else  
      return party.messages.length;

  }

  saveParty(party){
    localStorage.setItem(party.id, JSON.stringify(party));
  }

  async replaceIdWithMessage(partyID, messageID){
    let messageObj = await this.partyService.returnMessage(messageID);
    var index = this.allChats[partyID].messages.indexOf(messageID);

    if (index !== -1) {
      this.allChats[partyID].messages[index] = messageObj;
    }
  }

  async getAllMessages(){
    this.allPartys.forEach(party => {
      if(this.joinedParty(party.usersID)){
        this.allChats[party.id] = {
          id: party.id,
          name: party.name,
          messages: []
        }

        party.messages.forEach(messageID => {
          this.allChats[party.id].messages.push(messageID)
          this.replaceIdWithMessage(party.id, messageID)
        });

        this.allChats[party.id].messages.reverse();

      }
    });
  }

  subscribeToAllPartys(THIS) {
    this.partyService.getAllPartysSub().subscribe((value) => {
      if(value != null){
        THIS.allPartys = value;
        this.getAllMessages();
      }
    });
  }

  joinedParty(usersID){
    if(this.authService.currentUser != null && 'id' in this.authService.currentUser)
      return usersID.includes(this.authService.currentUser.id)
    else
     return null
  }

  async getPartyMostRecentMessage(party){
    return new Promise((resolve, reject) =>{
    let message = this.partyService.returnMessage(party.messages[party.messages.length-1]);
    resolve(message)
    })
  }

  openChat(partyId){
    if(this.allChats[partyId]){
      // console.log("all chats open chat", this.allChats[partyId])
    }
      this.inChat = true;
      this.activeChat = this.allChats[partyId];
  }

  sendMessage(partyId){
    // console.log("postStatus", this.postStatus.nativeElement.innerHTML)
    this.testText = this.postStatus.nativeElement.innerHTML
    this.textStatus = this.postStatus.nativeElement.innerHTML
    this.htmlStr = this.postStatus.nativeElement.innerHTML

    this.partyService.sendMessage(partyId, this.postStatus.nativeElement.innerHTML)
    this.postStatus.nativeElement.innerHTML = "";
  }

  closeChat(){
    this.inChat = false;
  }
}
