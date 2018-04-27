import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { GoogleMaps, GoogleMap } from '@ionic-native/google-maps';
import { ViewChild, ElementRef } from '@angular/core';
import { CameraPosition, LatLng, GoogleMapsEvent, Marker, MarkerOptions } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
 
  
  
  @ViewChild('map') mapElement:ElementRef;
  map : GoogleMap;

  constructor(public navCtrl: NavController,
  private _googleMaps : GoogleMaps,
  private _geoLoc: Geolocation) {

  }

  // buka map
  ngAfterViewInit(){
    let loc : LatLng;

    // inisialisasi map
    this.initMap();

    // jika map sudah siap dengan sempurna
    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      // mengambil lokasi saat ini
      this.getLocation().then(res=>{
        // jika lokasi saat ini sudah didapat
        // kirim ke kamera
        loc = new LatLng(
          res.coords.latitude, res.coords.longitude
        );
        this.moveCamera(loc);

        // buat marker location
        this.createMarker(loc, "Lokasiku")
          .then((marker:Marker) => {
            marker.showInfoWindow();
          })
          .catch(err => {
            console.error('Marker error', err);
          });
      })
      .catch(err => {
        console.log('Geolocation Error')
      })
    });

    //geolocation
    this.getLocation().then(res => {
      // lokasi disimpan dalam res
      console.log('latitude: ', res.coords.latitude);
      console.log('longitude : ', res.coords.longitude);
    })
    .catch(err => {
      console.log('Geolocation error ', err);
    });
  }

  createMarker(loc : LatLng, keterangan : string){
    let MarkerOptions : MarkerOptions = {
      position : loc,
      title : keterangan
    };
    return this.map.addMarker(MarkerOptions);
  }

  getLocation() {
    return this._geoLoc.getCurrentPosition();
  }

  initMap(): any {
    let element = this.mapElement.nativeElement;
    //this.map = this._googleMaps.create(element);
    this.map = GoogleMaps.create(element);
  }


  // memindahkan camera location
  moveCamera(loc: LatLng) {
    let cameraOption: CameraPosition<any> = {
      target : loc,
      zoom : 15,
      tilt : 10
    }
    this.map.moveCamera(cameraOption);
  }

  openMaps() {
    this.navCtrl.push('GooglemapsPage');
  }
}
