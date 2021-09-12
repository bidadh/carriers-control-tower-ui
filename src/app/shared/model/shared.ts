import {Injectable} from "@angular/core";
import {Adapter} from "../adapter";

export class GeoJsonPoint {
  // noinspection JSUnusedGlobalSymbols
  constructor(
    public x: number,
    public y: number,
    public type: string,
    public coordinates: Array<number>
  ) {
  }

  latlng(): LatLng {
    return new LatLng(this.y, this.x);
  }
}

export class LatLng {
  constructor(public lat: number, public lng: number) {
  }

  array(): Array<number> {
    return [this.lng, this.lat];
  }
}

@Injectable({
  providedIn: "root",
})
export class GeoJsonPointAdapter implements Adapter<GeoJsonPoint> {
  adapt(item: any): GeoJsonPoint {
    return new GeoJsonPoint(item.x, item.y, item.type, item.coordinates);
  }
}




