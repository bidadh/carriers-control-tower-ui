import {Injectable} from "@angular/core";
import {Adapter} from "../adapter";
import {Enterprise} from "../model/enterprise";
import {GeofenceAdapter} from "./geofence.adapter";
import {Geofence} from "../model/geofence";

@Injectable({
  providedIn: 'root'
})
export class EnterpriseAdapter implements Adapter<Enterprise> {
  constructor(private geofenceAdapter: GeofenceAdapter) {
  }

  adapt(item: any): Enterprise {
    let locations: Array<Geofence> = item.locations.map(it => this.geofenceAdapter.adapt(it));
    return new Enterprise(item.name, locations)
  }
}
