import {Component, OnInit, ViewChild} from '@angular/core';
import {MapInfoWindow, MapMarker} from "@angular/google-maps";
import {BehaviorSubject, Observable} from "rxjs";
import {GeofenceService} from "../geofence.service";
import {Geofence} from "../shared/model/geofence";
import {LatLng} from "../shared/model/shared";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  @ViewChild(MapInfoWindow, {static: false}) infoWindow: MapInfoWindow;

  center = {lat: -33.7072, lng: 151.1063};
  markerOptions = {draggable: true};
  markerPositions: google.maps.LatLngLiteral[] = [
    this.center
  ];
  zoom = 1;
  display?: google.maps.LatLngLiteral;

  locationOptions = {
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
  };
  private _locations$ = new BehaviorSubject<Array<Geofence>>([]);
  private _locationPaths$ = new BehaviorSubject<Array<Array<LatLng>>>([]);
  public readonly locationPaths$: Observable<Array<Array<LatLng>>> = this._locationPaths$.asObservable()

  constructor(private geofenceService: GeofenceService) {
  }

  addMarker(event: google.maps.MouseEvent) {
    this.markerPositions.push(event.latLng.toJSON());
  }

  move(event: google.maps.MouseEvent) {
    this.display = event.latLng.toJSON();
  }

  openInfoWindow(marker: MapMarker) {
    this.infoWindow.open(marker);
  }

  removeLastMarker() {
    this.markerPositions.pop();
  }

  ngOnInit(): void {
    this.geofenceService.findAll()
      .subscribe((all: Geofence[]) => {
        this._locations$.next(all);
        let paths = all.map(zp => zp.path());
        this._locationPaths$.next(paths);
      })
  }
}
