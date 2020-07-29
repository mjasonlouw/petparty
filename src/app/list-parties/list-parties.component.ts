import { Component, OnInit } from '@angular/core';
import { APIService } from '../API.service';
import { PartyService } from '../party.service';
import { AuthService } from '../auth.service';
import { trigger, state, style, animate, transition} from '@angular/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-list-parties',
  templateUrl: './list-parties.component.html',
  styleUrls: ['./list-parties.component.scss'],
  animations: [
    trigger('OpenOption', [
      state('open', style({
        // display: "block",
        // backgroundColor: 'blue',
        height: '458px',
        overflow: 'scroll',
        // paddingTop: '70px',
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
export class ListPartiesComponent implements OnInit {

  allPartys:any = []
  showHostingBool = true;

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

  constructor(
    private apiService: APIService,
    private partyService: PartyService,
    private authService: AuthService
  ) {

  }


  ngOnInit(): void {
    this.subscribeToAllPartys(this);
  }

  subscribeToAllPartys(THIS) {
    this.partyService.getAllPartysSub().subscribe((value) => {
      console.log("This is a new list of all the partys ",value);

      THIS.allPartys = value;
      // THIS.allPartys.forEach(element => {
      //   element.datetime = new Date(element.datetime)
      // });
    });
  }

  async toggleParty(id){
    await this.partyService.toggleJoinParty(id)
  }

  joinedParty(usersID){
    // if(this.authService.currentUser != null)
      // return usersID.includes(this.authService.currentUser.id)

      if(this.authService.currentUser != null)
      return usersID.includes(this.authService.currentUser.id)
    else
     return null
  }

  ownsParty(usersID){
    if(this.authService.currentUser != null)
      return usersID == this.authService.currentUser.id
    else
     return null

  }

  OpenOption(i) {

    for(let j = 0; j < this.options.length;j++){
      if(j == i)
        this.options[j].state = this.options[j].state === 'open' ? 'close' : 'open'; // change in data-bound value
      else
      this.options[j].state = 'close'; // change in data-bound value
    }
  }

  closeAll(event){
    console.log("closing all")
    for(let j = 0; j < this.options.length;j++){
      this.options[j].state = 'close'; // change in data-bound value
    }
  }

  showHosting(){
    this.showHostingBool = true
  }

  showAttending(){
    this.showHostingBool = false
  }

  deletePartys(id){
     console.log("delete id:", id)
    this.partyService.deleteParty(id)
  }

  createUrl(key){
    return "https://petparty-bucket.s3.eu-west-1.amazonaws.com/"+key;
  }

}
