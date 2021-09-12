import {Injectable} from "@angular/core";
import {Adapter} from "../adapter";
import {LocationEventUpdate} from "../model/locationEventUpdate";

@Injectable({
  providedIn: 'root'
})
export class LocationEventUpdateAdapter implements Adapter<LocationEventUpdate> {
  adapt(item: any): LocationEventUpdate {
    return new LocationEventUpdate(
      item.name,
      item.action,
      new Date(item.time),
      item.numberOfAssets
    );
  }

}
