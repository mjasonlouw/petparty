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

  partysMarkers = {}
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
    this.subscribeToAllPartys(this)

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
      center: [0, 0],
      antialias: true
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

  onDragEnd(t) {
    var lngLat = this.partyLocationMarker.getLatLng();
    // console.log(t)
  }

  async createPartyLocation(THIS) {
    this.locationService.hasChosenALocation = false;

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

    this.partyLocationMarker.on('dragend', function x(this){
      // var lngLat = this.partyLocationMarker.getLatLng();
      console.log(THIS.partyLocationMarker._lngLat.lng +" "+THIS.partyLocationMarker._lngLat.lat)
      THIS.locationService.partyLocation.longitude = THIS.partyLocationMarker._lngLat.lng;
      THIS.locationService.partyLocation.latitude = THIS.partyLocationMarker._lngLat.lat;
      THIS.locationService.hasChosenALocation = true;
    });
  }


  async deletePartyLocation() {
    this.locationService.hasChosenALocation = false;
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
        THIS.createPartyLocation(THIS);
      } else {
        THIS.deletePartyLocation();
      }
    });
  }

  subscribeToAllPartys(THIS) {
    this.partyService.getAllPartysSub().subscribe((value) => {
      console.log("This is a new list of all the partys ",value);
      THIS.allPartys = value;
      // THIS.allPartys.forEach(element => {
      //   element.datetime = new Date(element.datetime)
      // });
      // THIS.allPartys.forEach(element => {
      //   if (this.partysMarkers[element.id]) {
      //     console.log("Marker already exists");
          
      //   } else {
          
          

      //   }
      // });

      var geojson = {
        'type':'FeatureCollection',
        'features':[]
      }
      THIS.allPartys.forEach(element => {
        geojson['features'].push({
          'type': 'Feature',
          'properties': {
            'message': 'Foo',
            'iconSize': [50, 50]
            },
          'geometry': {
            'type': 'Point',
            'coordinates': [`${element.location.longitude}`, `${element.location.latitude}`,]
            }
        })
      });
      console.log("all features", geojson)

      geojson.features.forEach(function(marker) {
        // create a DOM element for the marker
        var el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage =
        'url("../../assets/images/purpleMonster.png")';
        el.style.width = marker.properties.iconSize[0] + 'px';
        el.style.height = marker.properties.iconSize[1] + 'px';
        el.style.backgroundSize = "cover"
        el.style.backgroundRepeat = 'no-repeat'
        el.style.borderRadius = "50%"
        el.style.borderWidth = "5px"
        el.style.borderColor = "white"
        el.style.borderStyle = "solid"
        el.style.boxShadow = "0px 0px 4px #585353 inset, 0px 0px 4px #585353"


    //     box-shadow: 0px 0px 4px #585353 inset, 0px 0px 4px #585353;
    // border-style: solid;
    // border-width: 5px;
    // border-color: white;
         
        el.addEventListener('click', function() {
        window.alert(marker.properties.message);
        });
         console.log("adding")
        // add marker to map
        new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .addTo(THIS.map);
        });




      ///-----
      
    });
  }

}
