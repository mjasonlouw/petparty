import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  userLocation = {
    latitude: 0,
    longitude: 0
  }

  options = {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 0
  };

  public currentUserLocation = new Observable((observer) => {
    navigator.geolocation.watchPosition(gotUserLocation, error, this.options);

    function gotUserLocation(location){
      observer.next(location);
    }
  
    function error(err){
      observer.error(err);
    }
  })

  constructor() {
    // let locationSubscriber = this.currentUserLocation.subscribe({
    //   next(location){
    //     console.log("Current location: ",location)
    //   },
    //   error(msg){
    //     console.log("Current location error: ",msg)
    //   }
    // })
    
  }

 
}
