import {DatePipe} from '@angular/common';

export class LocationEventUpdateContainer {
  datePipe = new DatePipe("en-US");

  constructor(
    public items: Array<LocationEventUpdate>
  ) {
  }

  countForLocation(name: string): number {
    let item = this.itemByName(name);
    return (item == null) ? 0 : item.numberOfAssets;
  }

  lastActiveForLocation(name: string): string {
    let item = this.itemByName(name);
    return (item == null) ? "N/A" : this.datePipe.transform(item.time, "mediumTime");
  }

  actionForLocation(name: string): LocationEventAction {
    let item = this.itemByName(name);
    return (item == null) ? LocationEventAction.NONE : item.action;
  }

  itemByName(name: string): LocationEventUpdate {
    let lcArray: Array<LocationEventUpdate> = this.items.filter(c => c.name === name);
    return (lcArray.length != 0) ? lcArray[0] : null;
  }
}
export class LocationEventUpdate {
  constructor(
    public name: string,
    public action: LocationEventAction,
    public time: Date,
    public numberOfAssets: number
  ) {
  }
}

export enum LocationEventAction {
  ENTERED = "ENTERED",
  EXITED = "EXITED",
  NONE = ""
}
