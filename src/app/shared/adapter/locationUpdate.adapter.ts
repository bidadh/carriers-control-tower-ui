import {Injectable} from "@angular/core";
import {Adapter} from "../adapter";
import {GeoJsonPointAdapter} from "../model/shared";
import {LocationUpdate} from "../model/asset";

@Injectable({
  providedIn: "root",
})
export class LocationUpdateAdapter implements Adapter<LocationUpdate> {
  constructor(private jeoJsonPointAdapter: GeoJsonPointAdapter) {
  }

  adapt(item: any): LocationUpdate {
    return new LocationUpdate(
      this.jeoJsonPointAdapter.adapt(item.position),
      new Date(item.updatedAt),
      item.properties
    )
  }
}
