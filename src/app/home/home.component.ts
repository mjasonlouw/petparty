import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { PartyService } from '../party.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  creatingParty: boolean;

  constructor(
    private authService: AuthService,
    private partyService: PartyService
  ) {
    this.subscribeToCreatingParty(this)
   }

  ngOnInit() {
  }

  async logout(){
    this.authService.logout();
  }

  async createParty(){
      this.partyService.setParty(!this.creatingParty);
  }

  subscribeToCreatingParty(THIS) {
    this.partyService.getParty().subscribe((value) => {
      console.log("is creating party ",value);
      THIS.creatingParty = value;
    });
  }
}
