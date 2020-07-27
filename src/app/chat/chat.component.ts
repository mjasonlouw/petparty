import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { APIService } from '../API.service';
import { PartyService } from '../party.service';
import { AuthService } from '../auth.service';
import { promises } from 'dns';
import { HttpClientModule } from '@angular/common/http';
import { PhotoService } from '../photo.service';
import {MatIconModule} from '@angular/material/icon';
import { trigger, state, style, animate, transition} from '@angular/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { toast } from 'aws-amplify';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  animations: [
    trigger('OpenOption', [
      state('open', style({
        // display: "block",
        // backgroundColor: 'blue',
        height: '*',
        overflow: "scroll"
      })),
      state('close', style({
        // display:'none',
        height:0,
        overflow: 'hidden'
      })),
      transition('open <=> close', animate('100ms linear'))  // animation timing
      // transition('close => open', animate('200ms linear'))
    ])
  ]
})
export class ChatComponent implements OnInit {

  options = [
    {
      state: 'close',
      name: 'Find Pet Parties'
    },
    {
      state: 'close',
      name: 'Create Party'
    },
    {
      state: 'close',
      name: 'My Parties'
    }
  ]


  allPartys:any = []
  allChats: any = {}
  inChat: boolean = false;
  activeChat: any = null;
  showAttachImageIcon = true;
  showUploadInput = false;
  selectedImage = null;
  previewUrl:any = null;
  allUnreadMessages:number = 0;

  @ViewChild("postStatus") postStatus : ElementRef;
  @ViewChild("textStatus") textStatus : ElementRef;
  htmlStr: string = '<strong>The Tortoise</strong> &amp; the Hare';
  testText= "here"

  constructor(
    private apiService: APIService,
    private partyService: PartyService,
    private authService: AuthService,
    private http: HttpClientModule,
    private photoService: PhotoService
  ) { }

  ngOnInit(): void {
    this.subscribeToAllPartys(this);
  }

  async check(){
    let total = 0
  
      this.allPartys.forEach(element => {
        let savedParty = JSON.parse(localStorage.getItem(element.id));
        if(savedParty)
        total = total +  element.messages.length - savedParty.messages.length;
        else  
        total = total +  element.messages.length;
      });
      
      this.allUnreadMessages = total -2 ;

  }

  calculateUnreadMessages(party): Number{
    this.check();

    // if(this.activeChat && this.activeChat.id == party.id)
    //   return 0

    let savedParty = JSON.parse(localStorage.getItem(party.id));
    if(savedParty)
      return party.messages.length - savedParty.messages.length;
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

        if(!(party.id in this.allChats))
          this.allChats[party.id] = {
            id: party.id,
            name: party.name,
            messages: []
          }

        party.messages.forEach(messageID => {
          let contains = false;
          this.allChats[party.id].messages.forEach(message => {
            if(message){
              if(typeof message === 'object'){
                if('id' in message && !contains){
                  contains = messageID == message.id
                }
              }
            }
          });

          if(!contains){
            this.allChats[party.id].messages.unshift(messageID)
            this.replaceIdWithMessage(party.id, messageID)
          }
        });
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
      this.allPartys.forEach(element => {
        if(element.id == partyId)
          this.saveParty(element)
      });
      
    }
      this.inChat = true;
      this.activeChat = this.allChats[partyId];
  }

  sendMessage(partyId){
    // console.log("postStatus", this.postStatus.nativeElement.innerHTML)
    this.testText = this.postStatus.nativeElement.innerHTML
    this.textStatus = this.postStatus.nativeElement.innerHTML
    this.htmlStr = this.postStatus.nativeElement.innerHTML

    if(this.postStatus.nativeElement.innerHTML.length > 0 || this.selectedImage != null){
      let imageName = "";
      if(this.selectedImage != null)
        imageName = this.photoService.addPhoto(this.selectedImage);

      this.partyService.sendMessage(partyId, this.postStatus.nativeElement.innerHTML, imageName)
      this.postStatus.nativeElement.innerHTML = "";
      this.previewUrl = null;

      this.allPartys.forEach(element => {
        if(element.id == partyId)
          this.saveParty(element)
      });

      


      this.selectedImage = null;
    }else{
      console.log("need content")
    }

  }

  closeChat(){
    this.inChat = false;
  }

  typing(event){
    console.log("typing", event.srcElement.innerHTML)
    if(event.srcElement.innerHTML.length < 10)
      this.showAttachImageIcon = true;
    else
    this.showAttachImageIcon = false;
  }

  showUpload(){
    this.showUploadInput= !this.showUploadInput
  }

  async onFileSelected(event){
    console.log("event", event)
    this.selectedImage = event.target.files[0];

    var reader = new FileReader();

    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (_event) =>{
      console.log(reader.result);
      this.previewUrl = reader.result;
    }

    // "https://petparty-bucket.s3.eu-west-1.amazonaws.com/a8d19e6b-2643-4b59-9438-71b9b255c016.jpeg"


  }

  createUrl(key){
    return "https://petparty-bucket.s3.eu-west-1.amazonaws.com/"+key;
  }



  failedTo(chatId, messageID){
    console.log("failed to load")

    this.allChats[chatId].messages.forEach(m => {
      if(m)
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

  OpenOption(i) {
    this.options[i].state = this.options[i].state === 'open' ? 'close' : 'open'; // change in data-bound value

    if(this.options[i].state === 'close')
      this.onlyCloseOption(1)
  }

  onlyOpenOption(i) {
    this.options[i].state = 'open'; // change in data-bound value
  }

  onlyCloseOption(i) {
    this.options[i].state = 'close'; // change in data-bound value
  }

  ifMe(message) {
    return message.creator == this.authService.currentUser.id;
  }




}
