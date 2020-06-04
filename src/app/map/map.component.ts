import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import * as mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import { LocationService } from '../location.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit {

  allMarkers = {};
  userMarker:any = null;
  map: any = null;
  style = 'mapbox://styles/mapbox/streets-v11';

  initialFly = true;


  constructor(
    private locationService:LocationService
  ) {
    
   }

  ngOnInit() {
    this.createInitialMap();
    this.updateMarkerLocation(32.958984, -5.353521, "randomMarker");
    this.updateMarkerLocation(43.50585, 5.615985, "randomMarker1");
    this.subscribeToUserLocationChanges(this);

    // this.map.fitBounds([
    //   [32.958984, -5.353521],
    //   [43.50585, 5.615985]
    //   ]);
  }

  flyTo(lon,lat){
    this.map.flyTo({
      center: [lon,lat],
      essential: true, // this animation is considered essential with respect to prefers-reduced-motion
      zoom: 14,
      speed: 1
      });
  }

  initialZoom(lon, lat){//only fly to on location subsciption once
    if(this.initialFly){
      this.flyTo(lon, lat)
      this.initialFly = false;
    }
  }
  

  createInitialMap(){
    mapboxgl.accessToken = environment.mapbox.accessToken;
      this.map = new mapboxgl.Map({
        container: 'map',
        style: this.style,
        zoom: 3,
        pitch: 0, // pitch in degrees
        bearing: 0, // bearing in degrees
        center: [0, 0]
    });
    
    this.map.setRenderWorldCopies(true);
    console.log("map created")
  }

  async updateMarkerLocation(lon, lat, id:string){
    if(id in this.allMarkers){
      console.log("updating marker");
      this.allMarkers[id].setLngLat([lon, lat]);
    }else{
      console.log("creating marker");
      this.allMarkers[id] = new mapboxgl.Marker().setLngLat([lon, lat]).addTo(this.map);
    }   
  }

  async updateUserLocation(lon, lat){
    if(this.userMarker){
      console.log("updating marker");
      this.userMarker.setLngLat([lon, lat]);
    }else{
      console.log("creating marker");
      this.userMarker = new mapboxgl.Marker().setLngLat([lon, lat]).addTo(this.map);
    }  
  }

  subscribeToUserLocationChanges(THIS){/* subscribes to user location for live updates */
    this.locationService.currentUserLocation.subscribe({
      next(location:any){
        console.log("Current location1: ",location)
        if("coords" in location){
          console.log( location['coords'].latitude+" - "+location['coords'].longitude );  
          THIS.updateUserLocation(location['coords'].longitude, location['coords'].latitude);
          THIS.initialZoom(location['coords'].longitude, location['coords'].latitude);
        }  
      },
      error(msg){
        console.log("Current location error: ",msg)
      }
    })
  }
}
