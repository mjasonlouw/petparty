import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartyService {


  CreatingParty: BehaviorSubject<boolean>;

  constructor() { 
    this.CreatingParty = new BehaviorSubject<boolean>(false);
  }

  getParty(): Observable<boolean> {
    return this.CreatingParty.asObservable();
  }
  setParty(newValue): void {
    console.log("newvalue", newValue)
    this.CreatingParty.next(newValue);
  }

}
