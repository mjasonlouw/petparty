import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import * as mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import { LocationService } from '../location.service';
import { PartyService } from '../party.service';
import { runInThisContext } from 'vm';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit {

  allMarkers = {};
  userMarker: any = null;
  partyLocationMarker: any = null;
  map: any = null;
  style = 'mapbox://styles/mapbox/streets-v11';

  initialFly = true;


  constructor(
    private locationService: LocationService,
    private partyService: PartyService
  ) {

  }

  ngOnInit() {
    this.createInitialMap();
    // this.updateMarkerLocation(32.958984, -5.353521, "randomMarker");
    // this.updateMarkerLocation(43.50585, 5.615985, "randomMarker1");
    this.subscribeToUserLocationChanges(this);
    this.subscribeToCreatingParty(this);

    // this.map.fitBounds([
    //   [32.958984, -5.353521],
    //   [43.50585, 5.615985]
    //   ]);
  }

  flyTo(lon, lat) {
    this.map.flyTo({
      center: [lon, lat],
      essential: true, // this animation is considered essential with respect to prefers-reduced-motion
      zoom: 14,
      speed: 1
    });
  }

  initialZoom(lon, lat) {//only fly to on location subsciption once
    if (this.initialFly) {
      this.flyTo(lon, lat)
      this.initialFly = false;
    }
  }


  createInitialMap() {
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

  async updateMarkerLocation(lon, lat, id: string) {
    if (id in this.allMarkers) {
      console.log("updating marker");
      this.allMarkers[id].setLngLat([lon, lat]);
    } else {
      console.log("creating marker");
      this.allMarkers[id] = new mapboxgl.Marker().setLngLat([lon, lat]).addTo(this.map);
    }
  }

  async updateUserLocation(lon, lat) {
    if (this.userMarker) {
      console.log("updating marker");
      this.userMarker.setLngLat([lon, lat]);
    } else {
      console.log("creating marker");
      this.userMarker = new mapboxgl.Marker().setLngLat([lon, lat]).addTo(this.map);
    }
  }

  async createPartyLocation() {
    var geojson = [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-77.031952, 38.913184]
        },
        properties: {
          'marker-color': '#3bb2d0',
          'marker-size': 'large',
          'marker-symbol': 'rocket'
        }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-122.413682, 37.775408]
        },
        properties: {
          'marker-color': '#3bb2d0',
          'marker-size': 'large',
          'marker-symbol': 'rocket'
        }
      }
    ];


    let center = this.map.getCenter().wrap()

    console.log("craete party location")
    if (!this.partyLocationMarker)
      this.partyLocationMarker = new mapboxgl.Marker({
        draggable: true,
        color: 'red'
      })
        .setLngLat([center.lng, center.lat])
        .addTo(this.map)

    function onDragEnd(THIS) {
      // var lngLat = THIS.partyLocationMarker.getLatLng();
      // console.log(lngLat)
    }


    this.partyLocationMarker.on('dragend', onDragEnd(this));
  }


  async deletePartyLocation() {
    if (this.partyLocationMarker)
      this.partyLocationMarker.remove();
    this.partyLocationMarker = null;
  }


  subscribeToUserLocationChanges(THIS) {/* subscribes to user location for live updates */
    this.locationService.currentUserLocation.subscribe({
      next(location: any) {
        console.log("Current location1: ", location)
        if ("coords" in location) {
          console.log(location['coords'].latitude + " - " + location['coords'].longitude);
          THIS.updateUserLocation(location['coords'].longitude, location['coords'].latitude);
          THIS.initialZoom(location['coords'].longitude, location['coords'].latitude);
        }
      },
      error(msg) {
        console.log("Current location error: ", msg)
      }
    })
  }

  subscribeToCreatingParty(THIS) {
    this.partyService.getParty().subscribe((value) => {
      console.log("change")
      if (value) {
        THIS.createPartyLocation();
      } else {
        THIS.deletePartyLocation();
      }
    });
  }
}
