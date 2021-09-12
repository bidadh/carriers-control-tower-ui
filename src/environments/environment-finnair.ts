// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {LatLng} from "../app/shared/model/shared";

interface Map {
  center: LatLng
  zoom: number
}

export interface MapEnterprise {
  id: string
  map: Map
  markers: Array<LatLng>,
  zoomThreshold: number
}

// noinspection JSUnusedLocalSymbols
let ericsson: MapEnterprise = {
  id: "5f2d3ca5772cb50d35f1f7fb",
  map: {
    center: new LatLng(59.4047, 17.9559),
    zoom: 15
  },
  markers: [
    new LatLng(59.4047, 17.9559)
  ],
  zoomThreshold: 9
}

// noinspection JSUnusedLocalSymbols
let sandvik: MapEnterprise = {
  id: "5f3cb715804d001c9eaa6845",
  map: {
    center: new LatLng(60.17685723584867, 18.18113380362479),
    zoom: 16
  },
  markers: [
    new LatLng(60.17685723584867, 18.18113380362479)
  ],
  zoomThreshold: 9
}

// noinspection JSUnusedLocalSymbols
let sandvikFactory: MapEnterprise = {
  id: "5f631dded38f3d1399cc60c8",
  map: {
    center: new LatLng(60.623587, 16.80683),
    zoom: 12
  },
  markers: [
    new LatLng(60.623587, 16.80683),
    new LatLng(60.69094581744679, 17.213345598301146),
    new LatLng(53.50490681629671, 9.92782209992427)
  ],
  zoomThreshold: 11
}

// noinspection JSUnusedLocalSymbols
let lh3: MapEnterprise = {
  id: "5f583e141480fc29c28aee92",
  map: {
    center: new LatLng(52.573922, -1.762870),
    zoom: 16
  },
  markers: [
    new LatLng(52.573922, -1.762870)
  ],
  zoomThreshold: 9
}

export const environment = {
  production: false,
  base_url: "http://localhost:8186",
  auth: "Basic Y2F0OnBhc3N3b3Jk",
  logo: "Finnair_Logo.svg",
  product: "",
  acronym: "",
  markerBackgroundColor: "00000",
  markerForegroundColor: "ffffff",
  enterprise: {
    id: "613b258e75039d1a5aef2a08",
    map: {
      center: new LatLng(60.46560407525638, 22.26400360560277),
      zoom: 12
    },
    markers: [
      new LatLng(60.623587, 16.80683),
      new LatLng(60.69094581744679, 17.213345598301146),
      new LatLng(53.50490681629671, 9.92782209992427)
    ],
    zoomThreshold: 11
  },
  // mapStyle: 'streets-v11',
  // mapStyle: 'outdoors-v11',
  mapStyle: 'navigation-day-v1',
  // mapStyle: 'navigation-night-v1',
  // https://docs.mapbox.com/api/maps/styles/#mapbox-styles
  catStyle: 'light',
  textColor: 'dark',
  mapLocationGrayFillColor : '#F4F4F4',
  mapLocationGrayLineColor : '#808080',
  mapbox: {
    accessToken: 'YOUR_MAPBOX_APIKEY'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
