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
  map: any;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 37.75;
  lng = -122.41;

  constructor(
    private locationService:LocationService
  ) {
    let locationSubscriber = this.locationService.currentUserLocation.subscribe({
      next(location:any){
        console.log("Current location1: ",location)
        if("coords" in location)
          alert(location['coords'].latitude+" - "+location['coords'].longitude)
        // alert('help')
      },
      error(msg){
        console.log("Current location error: ",msg)
      }
    })

    
   }

  ngOnInit() {
    mapboxgl.accessToken = environment.mapbox.accessToken;
      this.map = new mapboxgl.Map({
        container: 'map',
        style: this.style,
        zoom: 13,
        center: [this.lng, this.lat]
    });
    this.map.addControl(new mapboxgl.NavigationControl());
  }
}
