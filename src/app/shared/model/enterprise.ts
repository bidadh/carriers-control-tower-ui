import {Geofence} from "./geofence";

export class Enterprise {
  constructor(
    public name: string,
    public locations: Array<Geofence>
  ) {
  }
}
