import { Component, OnInit } from '@angular/core';
import { APIService } from '../API.service';
import { PartyService } from '../party.service';

@Component({
  selector: 'app-list-parties',
  templateUrl: './list-parties.component.html',
  styleUrls: ['./list-parties.component.scss']
})
export class ListPartiesComponent implements OnInit {

  allPartys:any = []

  constructor(
    private apiService: APIService,
    private partyService: PartyService
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

}
