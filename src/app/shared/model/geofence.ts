import {GeoJsonPoint, LatLng} from "./shared";
import {Criticality} from "./criticality";

export class Geofence {
  // noinspection JSUnusedLocalSymbols
  constructor(
    public name: string,
    public polygon: GeoJsonPolygon,
    public properties: Map<string, any>,
    public isFavourite: boolean,
    public criticality: Criticality
  ) {
  }

  path(): Array<LatLng> {
    return this.polygon.path();
  }

  points(): Array<Array<number>> {
    return this.path()
      .map(ll => [ll.lng, ll.lat])
  }

  style(): GeofenceStyle {
    let c = this.criticality
    let lw = this.isFavourite ? 3 : 1
    switch (c) {
      case Criticality.Low: return GeofenceStyle.low(lw)
      case Criticality.Normal: return GeofenceStyle.normal(lw)
      case Criticality.High: return GeofenceStyle.high(lw)
      case Criticality.Extreme: return GeofenceStyle.extreme(lw)
      default: return GeofenceStyle.normal(lw)
    }
  }
}

export class GeoJsonPolygon {
  constructor(public points: Array<GeoJsonPoint>) {
  }

  path(): Array<LatLng> {
    return this.points.map(p => p.latlng());
  }
}

export class GeofenceWithCount {
  constructor(
    public geofence: Geofence,
    public numberOfAssets: number
  ) {
  }

  isFav(): boolean {
    return this.geofence.isFavourite
  }

  style(): GeofenceStyle {
    return this.geofence.style()
  }
}

export class GeofenceStyle {
  constructor(
    public color: string,
    public fillColor: string,
    public lineColor: string,
    public lineWidth: number,
    public fillOpacity: number = 0.15
  ) {
  }

  static low(lw: number): GeofenceStyle {
    return new GeofenceStyle("green", "#288964", "#808080", lw)
  }

  static normal(lw: number): GeofenceStyle {
    return new GeofenceStyle("gray", "#F4F4F4", "#808080", lw)
  }

  static high(lw: number): GeofenceStyle {
    return new GeofenceStyle("yellow", "#DCAF00", "#808080", lw, 0.25)
  }

  static extreme(lw: number): GeofenceStyle {
    return new GeofenceStyle("red", "#DC2D37", "#808080", lw)
  }
}
