import {Component, OnInit} from '@angular/core';
import {MapboxService} from "./mapbox.service";
import * as mapboxgl from 'mapbox-gl';
import {environment} from "../../environments/environment";
import {GeofenceStyle, GeofenceWithCount} from "../shared/model/geofence";
import {Asset} from "../shared/model/asset";
import {Event} from "../shared/model/event";
import {DatePipe} from '@angular/common';

class Shape {
  constructor(public closed: boolean = true) {
  }

  private data: Array<Array<number>> = []
  private isCapturing: boolean = false

  toggleCapturing() {
    this.isCapturing = !this.isCapturing
    if(!this.isCapturing) {
      this.data = []
    }
  }

  isInCapturingMode(): boolean {
    return this.isCapturing
  }

  push(e: any) {
    if(!this.isCapturing) {
      return
    }

    this.data.push(e.lngLat.toArray())
  }

  shape(): string {
    if(!this.isCapturing) {
      return
    }

    if(this.closed && this.data.length < 2) {
      return ""
    }

    if(this.closed && this.data.length > 2) {
      this.data.push(this.data[0])
    }

    let localData = this.data;

    return localData
      .map(it => JSON.stringify(it))
      .reduce(function (p,c ,i) {
        let delimiter = (i == localData.length) ? "" : ", "
        return `${p} ${delimiter} \n ${c}`
      });
  }

  copy() {
    if(!this.isCapturing) {
      return
    }

    let text = this.shape();
    console.warn(text);
    let input = document.createElement('textarea');
    input.setAttribute("type", "hidden");
    input.innerHTML = text;
    document.body.appendChild(input);
    input.select();
    let result = document.execCommand('copy');
    document.body.removeChild(input);
    return result;
  }
}

let capturedPolygon: Shape = new Shape(true)
let capturedRoute: Shape = new Shape(false)

@Component({
  selector: 'app-mapbox',
  templateUrl: './mapbox.component.html',
  styleUrls: ['./mapbox.component.css']
})
export class MapboxComponent implements OnInit {
  showRoute = false;
  map: mapboxgl.Map;
  style = `mapbox://styles/mapbox/${environment.mapStyle}`;
  center = environment.enterprise.map.center;
  zoom = environment.enterprise.map.zoom;

  source: any;
  datePipe = new DatePipe("en-US");
  started = false

  constructor(private mapService: MapboxService) {
    mapboxgl.accessToken = environment.mapbox.accessToken;
  }

  ngOnInit(): void {
    this.initializeMap()
  }

  private initializeMap() {
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(position => {
    //     this.lat = position.coords.latitude;
    //     this.lng = position.coords.longitude;
    //     this.map.flyTo({
    //       center: [this.lng, this.lat]
    //     })
    //   });
    // }

    this.buildMap();
  }

  private buildMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: this.zoom,
      center: [this.center.lng, this.center.lat]
    });

    let self = this.map;

    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.on('click', function(e) {
      if(capturedPolygon.isInCapturingMode()) {
        capturedPolygon.push(e)
        return;
      }

      if (capturedRoute.isInCapturingMode()) {
        capturedRoute.copy()
      }
      capturedRoute.toggleCapturing()
    });

    this.map.on('contextmenu', function() {
      if(capturedPolygon.isInCapturingMode() ) {
        capturedPolygon.copy();
      }
      capturedPolygon.toggleCapturing()
    });

    this.map.on('mousemove', function(e) {
      if (capturedRoute.isInCapturingMode()) {
        capturedRoute.push(e)
      }
    });

    let addedMarkers = [];

    this.map.on('zoom', function () {
      let currentZoom = self.getZoom();
      if(currentZoom <= environment.enterprise.zoomThreshold) {
        environment.enterprise.markers.forEach(it => {
          let m = new mapboxgl.Marker()
            .setLngLat(it.array())
            .addTo(self);

          addedMarkers.push(m);
        })
      } else {
        addedMarkers.forEach(it => it.remove());
      }
    });

    this.map.on('load', () => {
      this.mapService.locations$
        .subscribe(items => {
          items.forEach((item: GeofenceWithCount) => {
            this.add(item);
          });
        });

      this.mapService.events$
        .subscribe(events => {
          events.forEach((e: Event) => {
            this.addEvent(e)
          });

        });

      this.mapService.assets$
        .subscribe(list => {
          list.forEach((asset: Asset) => {
            this.addMovingAsset(asset)
          });
        });

      this.mapService.appService.movedAssets$
        .subscribe(list => {
          list.forEach((asset: Asset) => {
            this.addMovingAsset(asset);
          });
        });

      this.mapService.appService.newPropertyEvents$
        .subscribe(list => {
          list.forEach( (event: Event) => {
            this.updateAssetByEvent(event);
          });
        });
      this.mapService.assetZoomAt$
        .subscribe(za => {
          this.map.fitBounds(za.points);
        })
      this.mapService.assetRoute$
        .subscribe(ar => {
/*
          if(ar.route.forceFit && ar.route.forceFollow) {
            this.map.fitBounds([
              ar.firstPoint(),
              ar.lastPoint()
            ]);
          }
*/
          if(this.showRoute) {
            let routeId = ar.asset + ' - route';
            let data = {
              'type': 'Feature',
              'properties': {},
              'geometry': {
                'type': 'LineString',
                'coordinates': ar.route.points
              }
            };

            let currentSource = this.map.getSource(routeId);
            if (typeof currentSource !== 'undefined') {
              // noinspection TypeScriptValidateJSTypes
              currentSource.setData(data);

              return;
            }

            this.map.addSource(routeId, {
              'type': 'geojson',
              'data': data
            });
            this.map.addLayer({
              'id': routeId,
              'type': 'line',
              'source': routeId,
              'layout': {
                'line-join': 'round',
                'line-cap': 'round'
              },
              'paint': {
                'line-color': '#d46617',
                'line-width': 2
              }
            });
          }
        })
    });
  }

  add(geofenceWithCount: GeofenceWithCount) {
    let geofenceId = geofenceWithCount.geofence.name;
    let style: GeofenceStyle = geofenceWithCount.style()
    let sourceData = {
      'type': 'Feature',
      'properties': {
        'id': geofenceId,
        'description': `<strong class="text-sm color-gray">${geofenceWithCount.geofence.name}</strong>
                            <p class="color-gray">
                                Assets: : <strong class="text-sm color-gray">${(geofenceWithCount.numberOfAssets)}</strong>`
      },
      'geometry': {
        'type': 'Polygon',
        'coordinates': [geofenceWithCount.geofence.points()]
      }
    };

    let currentSource = this.map.getSource(geofenceId);
    if (typeof currentSource !== 'undefined') {
      // noinspection TypeScriptValidateJSTypes
      currentSource.setData(sourceData);

      return;
    }

    this.map.addSource(geofenceId, {
      'type': 'geojson',
      'data': sourceData
    });
    this.map.addLayer({
      'id': geofenceId,
      'type': 'fill',
      'source': geofenceId,
      'layout': {},
      'paint': {
        'fill-color': style.fillColor,
        'fill-opacity': style.fillOpacity
      }
    });
    this.map.addLayer({
      'id': geofenceId + ' route',
      'type': 'line',
      'source': geofenceId,
      'layout': {
        'line-join': 'round',
        'line-cap': 'round'
      },
      'paint': {
        'line-color': style.lineColor,
        'line-width': style.lineWidth
      }
    });

    let popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    this.map.on('mouseenter', geofenceId, this.mouseenter(this.map, popup));
    this.map.on('mouseleave', geofenceId, this.mouseleave(this.map, popup));
  }

  mouseleave(map: mapboxgl.Map, p: mapboxgl.Popup) {
    return function () {
      map.getCanvas().style.cursor = '';
      p.remove();
    };
  }

  mouseenter(map: mapboxgl.Map, p: mapboxgl.Popup) {
    return function (e) {
      map.getCanvas().style.cursor = 'pointer';

      let coordinates = e.features[0].geometry.coordinates.slice();
      let description = e.features[0].properties.description;


      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }
      // console.warn(coordinates[0][0]);
      p
        .setLngLat(e.lngLat)
        .setHTML(description)
        .addTo(map);
    }
  }

  updateAssetByEvent(event: Event) {
    let bg = event.mapIconBGColor()
    let fg = event.mapIconFGColor()
    let url = `https://ui-avatars.com/api/?name=${event.asset.name}&rounded=true&background=${bg}&color=${fg}&size=24`
    this.map.loadImage(url, (err, image) => {
      this.map.removeImage(event.asset.deviceId);
      this.map.addImage(event.asset.deviceId, image);
    });
  }

  addEvent(event: Event) {
    let el = document.createElement('i');
    el.className = event.eventIconStyle();
    let ll = event.asset.currentPosition.position.latlng()

    let popupData = {
      closeButton: true,
      closeOnClick: true
    };
    let popupHtml = `<strong class="text-sm color-gray">${event.asset.name}</strong>
                          <p class="color-gray">
                              Update At: <strong class="text-sm color-black">${this.datePipe.transform(event.asset.currentPosition.updatedAt, "medium")}</strong><br/>
                              Type: <strong class="text-sm color-black">${event.action}</strong><br/>
                              Criticality: <strong class="text-sm color-black">${event.criticalityLevelText()}</strong><br/>
                              Value: <strong class="text-sm color-black">${event.property()}</strong><br/>
                          </p>`;
    let popup = new mapboxgl.Popup(popupData)
      .setHTML(popupHtml)

    new mapboxgl.Marker(el)
      .setLngLat(ll)
      .setPopup(popup)
      .addTo(this.map);
  }

  addMovingAsset(asset: Asset) {
    let currentMarker = this.map.getSource(asset.deviceId);
    let ll = asset.currentPosition.position.latlng()
    let url = `https://ui-avatars.com/api/?name=${asset.name}&rounded=true&background=${environment.markerBackgroundColor}&color=${environment.markerForegroundColor}&size=24`
    let markerData = {
      'properties': {
        'id': asset.deviceId,
        'description': `<strong class="text-sm color-gray">${asset.name}</strong>
                            <p class="color-gray">
                                Update At: <strong class="text-sm color-gray">${this.datePipe.transform(asset.currentPosition.updatedAt, "medium")}</strong><br/>
                                Group: <strong class="text-sm color-gray">${asset.assetType.name}</strong>
                            </p>`
      },
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [ll.lng, ll.lat]
      }
    };
    if (typeof currentMarker !== 'undefined') {
      // noinspection TypeScriptValidateJSTypes
      currentMarker.setData(markerData);

      return;
    }

    this.map.loadImage(url, this.addWithImage(this.map, asset, markerData));

    let popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    this.map.on('mouseenter', asset.deviceId, this.mouseenter(this.map, popup));
    this.map.on('mouseleave', asset.deviceId, this.mouseleave(this.map, popup));
  }

  addWithImage(map, asset, markerData) {
    return function (err, image) {
      map.addImage(asset.deviceId, image);

      map.addSource(asset.deviceId, {
        'type': 'geojson',
        'data': markerData
      });

      map.addLayer({
        "id": asset.deviceId,
        "type": "symbol",
        // "paint": {
        //   "circle-radius": 10,
        //   "circle-color": `hsla(${~~(360 * Math.random())},70%,70%,0.8)`
        // },
        "source": asset.deviceId,
        'layout': {
          'icon-image': asset.deviceId
        }
      });

    }
  }
}
