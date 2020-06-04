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

  public currentUserLocation = new Observable((observer) => {/* observable: can  be subscribed to, to get like user location changes */
    let watchId: number;

    watchId = navigator.geolocation.watchPosition(gotUserLocation, error, this.options);

    function gotUserLocation(location){
      observer.next(location);
    }
  
    function error(err){
      observer.error(err);
    }

    return {
      unsubscribe() {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  })


  constructor() {
    
  }

 
}
