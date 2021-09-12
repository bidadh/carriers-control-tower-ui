import {Injectable} from "@angular/core";
import {Adapter} from "../adapter";
import {GeoJsonPointAdapter} from "../model/shared";
import {Geofence, GeoJsonPolygon} from "../model/geofence";
import {Criticality} from "../model/criticality";

@Injectable({
  providedIn: "root",
})
export class GeofenceAdapter implements Adapter<Geofence> {
  constructor(private geoJsonPointAdapter: GeoJsonPointAdapter) {
  }

  adapt(item: any): Geofence {
    let points = item.polygon.points.map(it => this.geoJsonPointAdapter.adapt(it));
    let polygon = new GeoJsonPolygon(points);
    let isFavourite: boolean = item.isFavourite
    let criticality: Criticality = item.criticality
    return new Geofence(item.name, polygon, item.properties, isFavourite, criticality);
  }
}
