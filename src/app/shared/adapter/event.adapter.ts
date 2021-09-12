import {Injectable} from "@angular/core";
import {Adapter} from "../adapter";
import {Event} from "../model/event";
import {AssetAdapter} from "./asset.adapter";
import {GeofenceAdapter} from "./geofence.adapter";

@Injectable({
  providedIn: 'root'
})
export class EventAdapter implements Adapter<Event> {
  constructor(
    private assetAdapter: AssetAdapter,
    private geofenceAdapter: GeofenceAdapter
  ) {
  }

  adapt(item: any): Event {
    let asset = this.assetAdapter.adapt(item.asset);
    let time = new Date(item.time)
    let action = item.action
    let locations = item.locations.map(it => this.geofenceAdapter.adapt(it))
    return new Event(item.id, asset, locations, action, time, item.criticality);
  }
}
